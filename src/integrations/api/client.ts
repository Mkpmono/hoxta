/**
 * Unified API Client for PHP Backend (api.hoxta.com)
 * All WHMCS operations go through the PHP proxy.
 */

const BASE_URL = "https://api.hoxta.com";
const TOKEN_KEY = "auth_token";

// ============ TOKEN MANAGEMENT ============

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthToken(): string | null {
  return getToken();
}

// ============ GENERIC FETCHER ============

async function apiFetch<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: Record<string, unknown>;
    auth?: boolean;
  } = {}
): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  // Auto-logout on 401
  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent("auth:expired"));
    throw new AuthExpiredError("Session expired");
  }

  if (!res.ok || data.error) {
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }

  return data as T;
}

// ============ ERROR CLASSES ============

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class AuthExpiredError extends ApiError {
  constructor(message: string) {
    super(message, 401);
    this.name = "AuthExpiredError";
  }
}

// ============ AUTH ============

export interface LoginResponse {
  ok: boolean;
  token: string;
  userid: number;
  email: string;
}

export interface RegisterResponse {
  ok: boolean;
  clientid: number;
  token: string;
  email: string;
}

export interface ClientDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  address1?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  status: string;
  credit: number;
  currency: string;
  [key: string]: unknown;
}

export interface MeResponse {
  ok: boolean;
  client: ClientDetails;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/auth/login.php", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function register(payload: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phonenumber: string;
  companyname?: string;
  address2?: string;
}): Promise<RegisterResponse> {
  const data = await apiFetch<RegisterResponse>("/auth/register.php", {
    method: "POST",
    body: payload as unknown as Record<string, unknown>,
    auth: false,
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function me(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/auth/me.php");
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout.php", { method: "POST" });
  } catch {
    // ignore logout errors
  } finally {
    clearToken();
  }
}

// ============ SERVICES ============

export interface Service {
  id: string;
  name: string;
  type: "game" | "vps" | "web" | "dedicated";
  status: "active" | "suspended" | "pending" | "cancelled" | "terminated";
  price: number;
  billingCycle: string;
  nextDue: string;
  domain?: string;
  ip?: string;
  username?: string;
  dedicatedIp?: string;
  assignedIps?: string[];
}

export interface ServiceDetails extends Service {
  description?: string;
  createdAt: string;
  packageId: string;
  packageName: string;
  serverId?: string;
  serverName?: string;
}

export interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDifference: number;
  billingCycle: string;
}

export async function getServices(): Promise<{ services: Service[] }> {
  return apiFetch("/whmcs/services.php");
}

export async function getServiceDetails(serviceId: string): Promise<ServiceDetails> {
  return apiFetch(`/whmcs/services.php?id=${serviceId}`);
}

export async function getAvailableUpgrades(serviceId: string): Promise<UpgradeOption[]> {
  return apiFetch(`/whmcs/services.php?id=${serviceId}&action=upgrades`);
}

export async function createUpgrade(
  serviceId: string,
  upgradeOptionId: string
): Promise<{ success: boolean; orderId?: string }> {
  return apiFetch("/whmcs/services.php", {
    method: "POST",
    body: { action: "upgrade", serviceId, upgradeOptionId },
  });
}

export async function requestCancellation(
  serviceId: string,
  data: { type: "immediate" | "end_of_billing"; reason: string }
): Promise<{ success: boolean; ticketId?: string }> {
  return apiFetch("/whmcs/services.php", {
    method: "POST",
    body: { action: "cancel", serviceId, ...data },
  });
}

// ============ ORDERS ============

export interface Order {
  id: string;
  date: string;
  product: string;
  status: "pending" | "active" | "completed" | "cancelled" | "fraud";
  total: number;
  paymentMethod?: string;
  invoiceId?: string;
}

export async function getOrders(): Promise<{ orders: Order[] }> {
  return apiFetch("/whmcs/orders.php");
}

export async function createOrder(data: {
  planId: string;
  billingCycle: string;
  paymentMethod?: string;
}): Promise<{ success: boolean; orderId?: string; invoiceId?: string }> {
  return apiFetch("/whmcs/orders.php", { method: "POST", body: data });
}

// ============ INVOICES ============

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  taxed: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  datePaid?: string;
  status: "paid" | "unpaid" | "overdue" | "cancelled" | "refunded";
  subtotal: number;
  tax: number;
  total: number;
  credit: number;
  items: InvoiceItem[];
  paymentMethod?: string;
  notes?: string;
}

export async function getInvoices(status?: string): Promise<{ invoices: Invoice[] }> {
  const qs = status ? `?status=${status}` : "";
  return apiFetch(`/whmcs/invoices.php${qs}`);
}

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  return apiFetch(`/whmcs/invoices.php?id=${invoiceId}`);
}

export async function getInvoicePayLink(invoiceId: string): Promise<{ url: string }> {
  return apiFetch("/whmcs/invoices.php", {
    method: "POST",
    body: { action: "paylink", invoiceId },
  });
}

export async function markInvoicePaid(
  invoiceId: string,
  transactionId: string
): Promise<{ success: boolean }> {
  return apiFetch("/whmcs/invoices.php", {
    method: "POST",
    body: { action: "mark-paid", invoiceId, transactionId },
  });
}

// ============ TICKETS ============

export interface TicketMessage {
  id: string;
  sender: string;
  senderType: "client" | "admin" | "system";
  message: string;
  date: string;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "answered" | "customer-reply" | "closed" | "on-hold";
  priority: "low" | "medium" | "high";
  department: string;
  departmentId: string;
  lastReply: string;
  createdAt: string;
  messages?: TicketMessage[];
}

export interface Department {
  id: string;
  name: string;
}

export async function getTickets(): Promise<{ tickets: Ticket[] }> {
  return apiFetch("/whmcs/tickets.php");
}

export async function getTicket(ticketId: string): Promise<Ticket> {
  return apiFetch(`/whmcs/tickets.php?id=${ticketId}`);
}

export async function getDepartments(): Promise<{ departments: Department[] }> {
  return apiFetch("/whmcs/departments.php");
}

export async function openTicket(payload: {
  deptid: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
}): Promise<{ success: boolean; ticketId: string }> {
  return apiFetch("/whmcs/open_ticket.php", {
    method: "POST",
    body: payload as unknown as Record<string, unknown>,
  });
}

export async function replyTicket(
  ticketId: string,
  message: string
): Promise<{ success: boolean }> {
  return apiFetch("/whmcs/tickets.php", {
    method: "POST",
    body: { action: "reply", ticketId, message },
  });
}

// ============ DOMAINS ============

export interface DomainCheckResult {
  domain: string;
  status: "available" | "unavailable";
}

export async function checkDomains(domains: string[]): Promise<{ results: DomainCheckResult[] }> {
  return apiFetch("/whmcs/domain_check.php", {
    method: "POST",
    body: { domains } as unknown as Record<string, unknown>,
    auth: false,
  });
}

// ============ UNIFIED CLIENT EXPORT ============

export const apiClient = {
  // Auth
  login,
  register,
  me,
  logout,
  getAuthToken,

  // Services
  getServices,
  getServiceDetails,
  getAvailableUpgrades,
  createUpgrade,
  requestCancellation,

  // Orders
  getOrders,
  createOrder,

  // Invoices
  getInvoices,
  getInvoice,
  getInvoicePayLink,
  markInvoicePaid,

  // Tickets
  getTickets,
  getTicket,
  getDepartments,
  openTicket,
  replyTicket,

  // Domains
  checkDomains,
};
