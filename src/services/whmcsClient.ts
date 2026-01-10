/**
 * WHMCS Client Service Layer
 * This service provides a clean interface for all WHMCS-related operations.
 * It calls internal proxy endpoints, never WHMCS directly.
 * 
 * In MOCK MODE: Returns mock data
 * In LIVE MODE: Proxy endpoints call WHMCS API with server-side credentials
 */

import { mockApi } from "./mockApi";

export interface WhmcsConfig {
  isMockMode: boolean;
  baseUrl?: string;
}

// Check if we're in mock mode (always true until WHMCS is configured)
let mockMode = true;

export const setMockMode = (value: boolean) => {
  mockMode = value;
};

export const isMockMode = () => mockMode;

// API base for internal proxy endpoints
const API_BASE = "/api/whmcs";

// Generic fetch wrapper
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (mockMode) {
    return mockApi.handleRequest<T>(endpoint, options);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// ============ CLIENT METHODS ============

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
}

export async function getClientDetails(): Promise<ClientDetails> {
  return apiCall<ClientDetails>("/me");
}

// ============ SERVICES METHODS ============

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

export interface CancellationPayload {
  type: "immediate" | "end_of_billing";
  reason: string;
}

export async function getServices(): Promise<Service[]> {
  return apiCall<Service[]>("/services");
}

export async function getServiceDetails(serviceId: string): Promise<ServiceDetails> {
  return apiCall<ServiceDetails>(`/services/${serviceId}`);
}

export async function getAvailableUpgrades(serviceId: string): Promise<UpgradeOption[]> {
  return apiCall<UpgradeOption[]>(`/services/${serviceId}/upgrades`);
}

export async function createUpgrade(serviceId: string, upgradeOptionId: string): Promise<{ success: boolean; orderId?: string }> {
  return apiCall(`/services/${serviceId}/upgrade`, {
    method: "POST",
    body: JSON.stringify({ upgradeOptionId }),
  });
}

export async function requestCancellation(serviceId: string, payload: CancellationPayload): Promise<{ success: boolean; ticketId?: string }> {
  return apiCall(`/services/${serviceId}/cancel`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ============ ORDERS METHODS ============

export interface Order {
  id: string;
  date: string;
  product: string;
  status: "pending" | "active" | "completed" | "cancelled" | "fraud";
  total: number;
  paymentMethod?: string;
  invoiceId?: string;
}

export async function getOrders(): Promise<Order[]> {
  return apiCall<Order[]>("/orders");
}

// ============ INVOICES METHODS ============

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

export async function getInvoices(): Promise<Invoice[]> {
  return apiCall<Invoice[]>("/invoices");
}

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  return apiCall<Invoice>(`/invoices/${invoiceId}`);
}

export async function getInvoicePayLink(invoiceId: string): Promise<{ url: string }> {
  return apiCall<{ url: string }>(`/invoices/${invoiceId}/paylink`, {
    method: "POST",
  });
}

// ============ TICKETS METHODS ============

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

export interface CreateTicketPayload {
  departmentId: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  relatedServiceId?: string;
}

export interface ReplyTicketPayload {
  message: string;
  attachments?: File[];
}

export async function getTickets(): Promise<Ticket[]> {
  return apiCall<Ticket[]>("/tickets");
}

export async function getTicket(ticketId: string): Promise<Ticket> {
  return apiCall<Ticket>(`/tickets/${ticketId}`);
}

export async function createTicket(payload: CreateTicketPayload): Promise<{ success: boolean; ticketId: string }> {
  return apiCall(`/tickets`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function replyTicket(ticketId: string, payload: ReplyTicketPayload): Promise<{ success: boolean }> {
  return apiCall(`/tickets/${ticketId}/reply`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ============ CONNECTION TEST ============

export interface TestConnectionPayload {
  baseUrl: string;
  identifier: string;
  secret: string;
}

export async function testConnection(payload: TestConnectionPayload): Promise<{ success: boolean; message: string }> {
  // This would call the server-side proxy which tests the connection
  // For now, simulate a test
  return new Promise((resolve) => {
    setTimeout(() => {
      if (payload.baseUrl && payload.identifier && payload.secret) {
        resolve({ success: true, message: "Connection successful!" });
      } else {
        resolve({ success: false, message: "Invalid credentials" });
      }
    }, 1500);
  });
}

// Export all methods as a namespace
export const whmcsClient = {
  getClientDetails,
  getServices,
  getServiceDetails,
  getAvailableUpgrades,
  createUpgrade,
  requestCancellation,
  getOrders,
  getInvoices,
  getInvoice,
  getInvoicePayLink,
  getTickets,
  getTicket,
  createTicket,
  replyTicket,
  testConnection,
  isMockMode,
  setMockMode,
};
