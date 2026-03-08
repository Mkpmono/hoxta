import { BillingCycle } from "@/data/products";

export interface OrderSession {
  id: string;
  sessionId: string;
  productSlug: string;
  planId: string;
  billingCycle: BillingCycle;
  customer?: any;
  amount?: number;
  status: "pending" | "processing" | "completed" | "failed";
}

export async function createOrderSession(
  productSlug: string,
  plan: { id: string; pricing: { monthly: number } },
  billingCycle: BillingCycle
): Promise<OrderSession> {
  const id = crypto.randomUUID();
  const session: OrderSession = {
    id,
    sessionId: id,
    productSlug,
    planId: plan.id,
    billingCycle,
    amount: plan.pricing.monthly,
    status: "pending",
  };
  sessionStorage.setItem(`order_${id}`, JSON.stringify(session));
  return session;
}

export async function getOrderSession(id: string): Promise<OrderSession | null> {
  try {
    const raw = sessionStorage.getItem(`order_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function updateOrderCustomer(sessionId: string, customer: any): Promise<OrderSession> {
  const raw = sessionStorage.getItem(`order_${sessionId}`);
  const session: OrderSession = raw ? JSON.parse(raw) : { id: sessionId, sessionId };
  const updated = { ...session, customer };
  sessionStorage.setItem(`order_${sessionId}`, JSON.stringify(updated));
  return updated;
}

export async function processPayment(
  sessionId: string,
  paymentMethod: string,
  details?: Record<string, string>
): Promise<{ success: boolean; error?: string; redirectUrl?: string }> {
  // Redirect to WHMCS for payment processing
  window.open("https://billing.hoxta.com", "_blank");
  return { success: true };
}
