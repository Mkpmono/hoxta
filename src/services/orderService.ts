// Minimal order service - redirects to WHMCS for actual processing

export interface OrderSession {
  id: string;
  productSlug: string;
  planId: string;
  billingCycle: string;
  customer?: any;
  status: "pending" | "processing" | "completed" | "failed";
}

export function createOrderSession(data: {
  productSlug: string;
  planId: string;
  billingCycle: string;
}): OrderSession {
  return {
    id: crypto.randomUUID(),
    productSlug: data.productSlug,
    planId: data.planId,
    billingCycle: data.billingCycle,
    status: "pending",
  };
}

export function getOrderSession(id: string): OrderSession | null {
  try {
    const raw = sessionStorage.getItem(`order_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function updateOrderCustomer(session: OrderSession, customer: any): OrderSession {
  const updated = { ...session, customer };
  sessionStorage.setItem(`order_${session.id}`, JSON.stringify(updated));
  return updated;
}

export async function processPayment(session: OrderSession, paymentMethod: string): Promise<{ success: boolean; redirectUrl?: string }> {
  // Redirect to WHMCS for payment processing
  return { success: true, redirectUrl: "https://billing.hoxta.com" };
}
