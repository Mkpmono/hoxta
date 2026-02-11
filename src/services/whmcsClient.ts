/**
 * WHMCS Client Service Layer
 * This service provides a clean interface for all WHMCS-related operations.
 * It calls internal proxy endpoints via Edge Functions.
 */

import { supabase } from "@/integrations/supabase/client";

// Get auth token from storage
function getAuthToken(): string | null {
  return localStorage.getItem('hoxta_auth_token');
}

// Generic fetch wrapper using Edge Functions
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Determine which edge function to call based on endpoint
  const parts = endpoint.split('/').filter(Boolean);
  const resource = parts[0]; // services, orders, invoices, tickets, me, departments
  const path = '/' + parts.join('/');

  let functionName = 'whmcs-auth';
  if (resource === 'services') functionName = 'whmcs-services';
  else if (resource === 'orders') functionName = 'whmcs-orders';
  else if (resource === 'invoices') functionName = 'whmcs-invoices';
  else if (resource === 'tickets') functionName = 'whmcs-tickets';

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body: {
      path: '/' + parts.slice(resource === 'me' ? 0 : 1).join('/') || '/list',
      method: options?.method || 'GET',
      ...(options?.body ? JSON.parse(options.body as string) : {}),
    },
    headers,
  });

  if (error) {
    throw new Error(`API Error: ${error.message}`);
  }

  return data as T;
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
};
