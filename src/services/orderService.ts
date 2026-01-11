/**
 * Order Service - Mock Mode Implementation
 * Handles order creation and payment processing.
 * Uses mock data by default; ready for WHMCS proxy integration.
 */

import { ProductPlan, BillingCycle, calculateOrderTotal, PaymentMethodId } from "@/data/products";
import { CustomerData } from "@/components/checkout/CustomerForm";

let mockMode = true;

export const setOrderMockMode = (value: boolean) => { mockMode = value; };
export const isOrderMockMode = () => mockMode;

export interface OrderSession {
  sessionId: string;
  productSlug: string;
  planId: string;
  billingCycle: BillingCycle;
  customer?: CustomerData;
  invoiceId?: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "paid" | "failed" | "cancelled";
  createdAt: string;
}

// In-memory store for demo
const orderSessions = new Map<string, OrderSession>();

function generateId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

export async function createOrderSession(
  productSlug: string,
  plan: ProductPlan,
  billingCycle: BillingCycle
): Promise<OrderSession> {
  await new Promise((r) => setTimeout(r, 500)); // Simulate network delay
  
  const { total } = calculateOrderTotal(plan, billingCycle);
  const session: OrderSession = {
    sessionId: generateId(),
    productSlug,
    planId: plan.id,
    billingCycle,
    amount: total,
    currency: "USD",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  
  orderSessions.set(session.sessionId, session);
  return session;
}

export async function updateOrderCustomer(
  sessionId: string,
  customer: CustomerData
): Promise<OrderSession> {
  await new Promise((r) => setTimeout(r, 300));
  
  const session = orderSessions.get(sessionId);
  if (!session) throw new Error("Session not found");
  
  session.customer = customer;
  session.invoiceId = `INV-${Date.now()}`;
  orderSessions.set(sessionId, session);
  return session;
}

export async function processPayment(
  sessionId: string,
  method: PaymentMethodId,
  _details?: Record<string, string>
): Promise<{ success: boolean; redirectUrl?: string; error?: string }> {
  await new Promise((r) => setTimeout(r, 1500)); // Simulate payment processing
  
  const session = orderSessions.get(sessionId);
  if (!session) return { success: false, error: "Session not found" };
  
  // Mock mode: always succeed
  if (mockMode) {
    session.status = "paid";
    orderSessions.set(sessionId, session);
    return { success: true };
  }
  
  // In real mode, this would call the backend proxy
  return { success: true };
}

export async function getOrderSession(sessionId: string): Promise<OrderSession | null> {
  return orderSessions.get(sessionId) || null;
}
