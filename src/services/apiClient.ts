/**
 * Unified API Client
 * Calls Edge Functions for all WHMCS operations.
 * Automatically switches between mock mode and live mode based on backend configuration.
 */

import { supabase } from "@/integrations/supabase/client";

// Cache mock mode status
let mockModeCache: boolean | null = null;
let mockModeCheckPromise: Promise<boolean> | null = null;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  mockMode?: boolean;
}

// Check if we're in mock mode by calling the backend
export async function checkMockMode(): Promise<boolean> {
  if (mockModeCache !== null) return mockModeCache;
  
  if (mockModeCheckPromise) return mockModeCheckPromise;
  
  mockModeCheckPromise = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke('whmcs-auth', {
        body: {},
        method: 'GET'
      });
      
      if (error) {
        console.warn('Mock mode check failed:', error);
        mockModeCache = true;
        return true;
      }
      
      mockModeCache = data?.mockMode ?? true;
      return mockModeCache;
    } catch {
      mockModeCache = true;
      return true;
    }
  })();
  
  return mockModeCheckPromise;
}

export function isMockMode(): boolean {
  return mockModeCache ?? true;
}

export function clearMockModeCache(): void {
  mockModeCache = null;
  mockModeCheckPromise = null;
}

// Get auth token from storage
function getAuthToken(): string | null {
  return localStorage.getItem('hoxta_auth_token');
}

function setAuthToken(token: string): void {
  localStorage.setItem('hoxta_auth_token', token);
}

function clearAuthToken(): void {
  localStorage.removeItem('hoxta_auth_token');
}

// Generic Edge Function caller
async function callEdgeFunction<T>(
  functionName: string,
  path: string = '',
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, unknown>;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data, error } = await supabase.functions.invoke(functionName, {
      body: { 
        path,
        method: options.method || 'GET',
        ...(options.body || {})
      },
      headers
    });

    if (error) {
      return { error: error.message };
    }

    return { data, mockMode: data?.mockMode };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Request failed' };
  }
}

// ============ AUTH METHODS ============

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

export interface LoginResponse {
  success: boolean;
  token?: string;
  client?: ClientDetails;
  error?: string;
  mockMode?: boolean;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const result = await callEdgeFunction<LoginResponse>('whmcs-auth', '/login', {
    method: 'POST',
    body: { email, password }
  });

  if (result.data?.token) {
    setAuthToken(result.data.token);
  }

  return result.data || { success: false, error: result.error };
}

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
}): Promise<LoginResponse> {
  const result = await callEdgeFunction<LoginResponse>('whmcs-auth', '/register', {
    method: 'POST',
    body: data
  });

  if (result.data?.token) {
    setAuthToken(result.data.token);
  }

  return result.data || { success: false, error: result.error };
}

export async function logout(): Promise<void> {
  await callEdgeFunction('whmcs-auth', '/logout', { method: 'POST' });
  clearAuthToken();
}

export async function getMe(): Promise<ApiResponse<ClientDetails>> {
  return callEdgeFunction<ClientDetails>('whmcs-auth', '/me');
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

export async function getServices(): Promise<ApiResponse<{ services: Service[] }>> {
  return callEdgeFunction('whmcs-services', '/list');
}

export async function getServiceDetails(serviceId: string): Promise<ApiResponse<ServiceDetails>> {
  return callEdgeFunction('whmcs-services', `/${serviceId}`);
}

export async function getAvailableUpgrades(serviceId: string): Promise<ApiResponse<{ upgrades: UpgradeOption[] }>> {
  return callEdgeFunction('whmcs-services', `/${serviceId}/upgrades`);
}

export async function createUpgrade(serviceId: string, upgradeOptionId: string): Promise<ApiResponse<{ success: boolean; orderId?: string }>> {
  return callEdgeFunction('whmcs-services', `/${serviceId}/upgrade`, {
    method: 'POST',
    body: { upgradeOptionId }
  });
}

export async function requestCancellation(serviceId: string, data: { type: 'immediate' | 'end_of_billing'; reason: string }): Promise<ApiResponse<{ success: boolean; ticketId?: string }>> {
  return callEdgeFunction('whmcs-services', `/${serviceId}/cancel`, {
    method: 'POST',
    body: data
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

export interface CreateOrderData {
  planId: string;
  billingCycle: string;
  paymentMethod?: string;
}

export async function createOrder(data: CreateOrderData): Promise<ApiResponse<{ success: boolean; orderId?: string; invoiceId?: string }>> {
  return callEdgeFunction('whmcs-orders', '/create', {
    method: 'POST',
    body: { ...data }
  });
}

export async function getOrders(): Promise<ApiResponse<{ orders: Order[] }>> {
  return callEdgeFunction('whmcs-orders', '/list');
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

export async function getInvoices(): Promise<ApiResponse<{ invoices: Invoice[] }>> {
  return callEdgeFunction('whmcs-invoices', '/list');
}

export async function getInvoice(invoiceId: string): Promise<ApiResponse<Invoice>> {
  return callEdgeFunction('whmcs-invoices', `/${invoiceId}`);
}

export async function getInvoicePayLink(invoiceId: string): Promise<ApiResponse<{ url: string }>> {
  return callEdgeFunction('whmcs-invoices', `/${invoiceId}/paylink`, { method: 'POST' });
}

export async function markInvoicePaid(invoiceId: string, transactionId: string): Promise<ApiResponse<{ success: boolean }>> {
  return callEdgeFunction('whmcs-invoices', `/${invoiceId}/mark-paid`, {
    method: 'POST',
    body: { transactionId }
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

export interface CreateTicketData {
  departmentId: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  relatedServiceId?: string;
}

export async function getTickets(): Promise<ApiResponse<{ tickets: Ticket[] }>> {
  return callEdgeFunction('whmcs-tickets', '/list');
}

export async function getTicket(ticketId: string): Promise<ApiResponse<Ticket>> {
  return callEdgeFunction('whmcs-tickets', `/${ticketId}`);
}

export async function createTicket(data: CreateTicketData): Promise<ApiResponse<{ success: boolean; ticketId: string }>> {
  return callEdgeFunction('whmcs-tickets', '/create', {
    method: 'POST',
    body: { ...data }
  });
}

export async function replyTicket(ticketId: string, message: string): Promise<ApiResponse<{ success: boolean }>> {
  return callEdgeFunction('whmcs-tickets', `/${ticketId}/reply`, {
    method: 'POST',
    body: { message }
  });
}

// ============ PAYMENTS METHODS ============

export interface PaymentIntent {
  clientSecret?: string;
  paymentUrl?: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
}

export async function createPaymentIntent(
  invoiceId: string,
  method: 'stripe' | 'paypal' | 'crypto' | 'paysafe',
  amount: number
): Promise<ApiResponse<PaymentIntent>> {
  return callEdgeFunction('payments', '/create-intent', {
    method: 'POST',
    body: { invoiceId, method, amount }
  });
}

export async function confirmPayment(paymentId: string, method: string): Promise<ApiResponse<{ success: boolean; transactionId?: string }>> {
  return callEdgeFunction('payments', '/confirm', {
    method: 'POST',
    body: { paymentId, method }
  });
}

// Export as unified client
export const apiClient = {
  // Mock mode
  checkMockMode,
  isMockMode,
  clearMockModeCache,
  
  // Auth
  login,
  register,
  logout,
  getMe,
  
  // Services
  getServices,
  getServiceDetails,
  getAvailableUpgrades,
  createUpgrade,
  requestCancellation,
  
  // Orders
  createOrder,
  getOrders,
  
  // Invoices
  getInvoices,
  getInvoice,
  getInvoicePayLink,
  markInvoicePaid,
  
  // Tickets
  getTickets,
  getTicket,
  createTicket,
  replyTicket,
  
  // Payments
  createPaymentIntent,
  confirmPayment,
};
