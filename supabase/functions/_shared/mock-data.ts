/**
 * Mock Data for WHMCS API
 * Used when WHMCS is not configured
 */

export const mockClient = {
  id: 1,
  email: 'demo@hoxta.com',
  firstName: 'John',
  lastName: 'Doe',
  companyName: 'Demo Company',
  address1: '123 Demo Street',
  city: 'San Francisco',
  state: 'CA',
  postcode: '94102',
  country: 'US',
  phone: '+1-555-123-4567',
  status: 'Active',
  credit: 25.00,
  currency: 'USD',
};

export const mockServices = [
  {
    id: '1',
    name: 'Minecraft Server - Premium',
    type: 'game',
    status: 'active',
    price: 12.00,
    billingCycle: 'monthly',
    nextDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    ip: '45.123.45.67:25565',
  },
  {
    id: '2',
    name: 'VPS Standard - 8GB',
    type: 'vps',
    status: 'active',
    price: 24.99,
    billingCycle: 'monthly',
    nextDue: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    ip: '192.168.1.100',
  },
  {
    id: '3',
    name: 'Web Hosting - Professional',
    type: 'web',
    status: 'active',
    price: 8.99,
    billingCycle: 'monthly',
    nextDue: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    domain: 'example.com',
  },
];

export const mockOrders = [
  {
    id: 'ORD-001',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    product: 'VPS Standard - 8GB',
    status: 'active',
    total: 24.99,
    paymentMethod: 'Stripe',
    invoiceId: 'INV-001',
  },
  {
    id: 'ORD-002',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    product: 'Minecraft Server - Premium',
    status: 'active',
    total: 12.00,
    paymentMethod: 'PayPal',
    invoiceId: 'INV-002',
  },
];

export const mockInvoices = [
  {
    id: 'INV-001',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
    datePaid: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'paid',
    subtotal: 24.99,
    tax: 0,
    total: 24.99,
    credit: 0,
    items: [{ id: '1', description: 'VPS Standard - 8GB (Monthly)', amount: 24.99, taxed: false }],
    paymentMethod: 'Stripe',
  },
  {
    id: 'INV-002',
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'unpaid',
    subtotal: 12.00,
    tax: 0,
    total: 12.00,
    credit: 0,
    items: [{ id: '2', description: 'Minecraft Server - Premium (Monthly)', amount: 12.00, taxed: false }],
  },
];

export const mockTickets = [
  {
    id: 'TKT-001',
    subject: 'Server Setup Assistance',
    status: 'answered',
    priority: 'medium',
    department: 'Technical Support',
    departmentId: '1',
    lastReply: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: 'msg-1',
        sender: 'John Doe',
        senderType: 'client',
        message: 'I need help setting up my Minecraft server with mods.',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'Support Team',
        senderType: 'admin',
        message: 'Sure! I can help you with that. What mods would you like to install?',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Billing Question',
    status: 'closed',
    priority: 'low',
    department: 'Billing',
    departmentId: '2',
    lastReply: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to generate session storage key
export function generateSessionToken(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

// Mock session storage (in production, use database or KV store)
const sessions = new Map<string, { clientId: number; email: string; expiresAt: number }>();

export function createSession(clientId: number, email: string): string {
  const token = generateSessionToken();
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  sessions.set(token, { clientId, email, expiresAt });
  return token;
}

export function validateSession(token: string): { clientId: number; email: string } | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return { clientId: session.clientId, email: session.email };
}

export function destroySession(token: string): void {
  sessions.delete(token);
}
