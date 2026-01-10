/**
 * Mock API Handler
 * Simulates WHMCS API responses for development and demo mode
 */

import type {
  ClientDetails,
  Service,
  ServiceDetails,
  UpgradeOption,
  Order,
  Invoice,
  Ticket,
} from "./whmcsClient";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============ MOCK DATA ============

const mockClientDetails: ClientDetails = {
  id: "1",
  email: "client@demo.hoxta",
  firstName: "Demo",
  lastName: "Client",
  companyName: "Demo Company",
  address1: "123 Demo Street",
  city: "Bucharest",
  state: "Bucharest",
  postcode: "010101",
  country: "RO",
  phone: "+40 123 456 789",
  status: "Active",
  credit: 25.50,
  currency: "USD",
};

const mockServices: Service[] = [
  {
    id: "SVC001",
    name: "Minecraft Server - Pro",
    type: "game",
    status: "active",
    price: 15.99,
    billingCycle: "Monthly",
    nextDue: "2026-02-10",
    ip: "45.12.34.56:25565",
    domain: "mc.demo-server.com",
  },
  {
    id: "SVC002",
    name: "VPS Standard",
    type: "vps",
    status: "active",
    price: 12.99,
    billingCycle: "Monthly",
    nextDue: "2026-02-05",
    ip: "45.12.34.57",
    dedicatedIp: "45.12.34.57",
  },
  {
    id: "SVC003",
    name: "Web Hosting - Professional",
    type: "web",
    status: "active",
    price: 6.99,
    billingCycle: "Monthly",
    nextDue: "2026-02-15",
    domain: "demo-website.com",
    username: "demoweb1",
  },
  {
    id: "SVC004",
    name: "FiveM Server",
    type: "game",
    status: "pending",
    price: 29.99,
    billingCycle: "Monthly",
    nextDue: "2026-02-01",
  },
];

const mockServiceDetails: Record<string, ServiceDetails> = {
  SVC001: {
    ...mockServices[0],
    description: "High-performance Minecraft server with 8GB RAM, NVMe storage, and DDoS protection.",
    createdAt: "2025-06-15",
    packageId: "PKG001",
    packageName: "Minecraft Pro",
    serverId: "SRV01",
    serverName: "Game Server EU-1",
  },
  SVC002: {
    ...mockServices[1],
    description: "Virtual Private Server with 4 vCPU, 8GB RAM, 100GB NVMe SSD.",
    createdAt: "2025-08-20",
    packageId: "PKG010",
    packageName: "VPS Standard",
    serverId: "SRV05",
    serverName: "VPS Cluster EU-2",
  },
  SVC003: {
    ...mockServices[2],
    description: "Professional web hosting with unlimited bandwidth and free SSL.",
    createdAt: "2025-09-01",
    packageId: "PKG020",
    packageName: "Web Pro",
    serverId: "SRV10",
    serverName: "Web Server EU-1",
  },
  SVC004: {
    ...mockServices[3],
    description: "FiveM roleplay server with 64 slots and custom framework support.",
    createdAt: "2026-01-01",
    packageId: "PKG005",
    packageName: "FiveM Standard",
  },
};

const mockUpgradeOptions: Record<string, UpgradeOption[]> = {
  SVC001: [
    {
      id: "UPG001",
      name: "Minecraft Server - Elite",
      description: "16GB RAM, Priority Support, Custom Plugins",
      price: 29.99,
      priceDifference: 14.00,
      billingCycle: "Monthly",
    },
    {
      id: "UPG002",
      name: "Minecraft Server - Ultimate",
      description: "32GB RAM, Dedicated IP, Premium Support",
      price: 49.99,
      priceDifference: 34.00,
      billingCycle: "Monthly",
    },
  ],
  SVC002: [
    {
      id: "UPG010",
      name: "VPS Pro",
      description: "8 vCPU, 16GB RAM, 200GB NVMe",
      price: 24.99,
      priceDifference: 12.00,
      billingCycle: "Monthly",
    },
    {
      id: "UPG011",
      name: "VPS Enterprise",
      description: "16 vCPU, 32GB RAM, 500GB NVMe",
      price: 49.99,
      priceDifference: 37.00,
      billingCycle: "Monthly",
    },
  ],
  SVC003: [
    {
      id: "UPG020",
      name: "Web Hosting - Business",
      description: "100GB NVMe, Dedicated IP, Priority Support",
      price: 12.99,
      priceDifference: 6.00,
      billingCycle: "Monthly",
    },
  ],
};

const mockOrders: Order[] = [
  { id: "ORD001", date: "2026-01-08", product: "Minecraft Server - Pro", status: "completed", total: 15.99, paymentMethod: "PayPal", invoiceId: "INV001" },
  { id: "ORD002", date: "2026-01-05", product: "VPS Standard", status: "active", total: 12.99, paymentMethod: "Stripe", invoiceId: "INV002" },
  { id: "ORD003", date: "2026-01-03", product: "Web Hosting - Professional", status: "completed", total: 6.99, paymentMethod: "PayPal", invoiceId: "INV003" },
  { id: "ORD004", date: "2026-01-01", product: "FiveM Server", status: "pending", total: 29.99, invoiceId: "INV004" },
];

const mockInvoices: Invoice[] = [
  {
    id: "INV001",
    date: "2026-01-10",
    dueDate: "2026-02-10",
    status: "unpaid",
    subtotal: 15.99,
    tax: 0,
    total: 15.99,
    credit: 0,
    items: [
      { id: "ITEM001", description: "Minecraft Server - Pro (01/10/2026 - 02/10/2026)", amount: 15.99, taxed: false },
    ],
  },
  {
    id: "INV002",
    date: "2026-01-05",
    dueDate: "2026-02-05",
    datePaid: "2026-01-05",
    status: "paid",
    subtotal: 12.99,
    tax: 0,
    total: 12.99,
    credit: 0,
    paymentMethod: "Stripe",
    items: [
      { id: "ITEM002", description: "VPS Standard (01/05/2026 - 02/05/2026)", amount: 12.99, taxed: false },
    ],
  },
  {
    id: "INV003",
    date: "2025-12-15",
    dueDate: "2026-01-15",
    datePaid: "2025-12-16",
    status: "paid",
    subtotal: 6.99,
    tax: 0,
    total: 6.99,
    credit: 0,
    paymentMethod: "PayPal",
    items: [
      { id: "ITEM003", description: "Web Hosting - Professional (12/15/2025 - 01/15/2026)", amount: 6.99, taxed: false },
    ],
  },
  {
    id: "INV004",
    date: "2025-12-01",
    dueDate: "2026-01-01",
    status: "overdue",
    subtotal: 29.99,
    tax: 0,
    total: 29.99,
    credit: 0,
    items: [
      { id: "ITEM004", description: "FiveM Server (12/01/2025 - 01/01/2026)", amount: 29.99, taxed: false },
    ],
    notes: "Payment overdue. Please pay to avoid service suspension.",
  },
];

const mockTickets: Ticket[] = [
  {
    id: "TKT001",
    subject: "Server not starting",
    status: "open",
    priority: "high",
    department: "Technical Support",
    departmentId: "DEP001",
    lastReply: "2026-01-10 14:30",
    createdAt: "2026-01-10 10:00",
    messages: [
      {
        id: "MSG001",
        sender: "Demo Client",
        senderType: "client",
        message: "My Minecraft server won't start after the latest update. I get an error about Java version.",
        date: "2026-01-10 10:00",
      },
      {
        id: "MSG002",
        sender: "Support Team",
        senderType: "admin",
        message: "Thank you for reaching out. Could you please share the error log from your control panel? You can find it under Server > Console > Logs.",
        date: "2026-01-10 14:30",
      },
    ],
  },
  {
    id: "TKT002",
    subject: "Upgrade VPS plan",
    status: "answered",
    priority: "medium",
    department: "Sales",
    departmentId: "DEP002",
    lastReply: "2026-01-09 16:00",
    createdAt: "2026-01-09 09:00",
    messages: [
      {
        id: "MSG003",
        sender: "Demo Client",
        senderType: "client",
        message: "I'd like to upgrade my VPS to the Pro plan. What's the process?",
        date: "2026-01-09 09:00",
      },
      {
        id: "MSG004",
        sender: "Support Team",
        senderType: "admin",
        message: "You can upgrade directly from your panel. Go to Services > Your VPS > Upgrade. The price difference will be prorated for the remaining billing period.",
        date: "2026-01-09 16:00",
      },
    ],
  },
];

const departments = [
  { id: "DEP001", name: "Technical Support" },
  { id: "DEP002", name: "Sales" },
  { id: "DEP003", name: "Billing" },
];

// ============ MOCK API HANDLER ============

function parseEndpoint(endpoint: string) {
  const parts = endpoint.split("/").filter(Boolean);
  return {
    resource: parts[0],
    id: parts[1],
    action: parts[2],
  };
}

export const mockApi = {
  async handleRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    await delay(300 + Math.random() * 400); // Simulate network latency

    const { resource, id, action } = parseEndpoint(endpoint);
    const method = options?.method || "GET";

    // Client details
    if (endpoint === "/me") {
      return mockClientDetails as T;
    }

    // Services
    if (resource === "services") {
      if (!id) {
        return mockServices as T;
      }
      if (action === "upgrades") {
        return (mockUpgradeOptions[id] || []) as T;
      }
      if (action === "upgrade" && method === "POST") {
        return { success: true, orderId: `ORD${Date.now()}` } as T;
      }
      if (action === "cancel" && method === "POST") {
        return { success: true, ticketId: `TKT${Date.now()}` } as T;
      }
      return (mockServiceDetails[id] || mockServices.find((s) => s.id === id)) as T;
    }

    // Orders
    if (resource === "orders") {
      return mockOrders as T;
    }

    // Invoices
    if (resource === "invoices") {
      if (!id) {
        return mockInvoices as T;
      }
      if (action === "paylink" && method === "POST") {
        return { url: `https://demo.whmcs.com/pay/invoice/${id}` } as T;
      }
      return mockInvoices.find((inv) => inv.id === id) as T;
    }

    // Tickets
    if (resource === "tickets") {
      if (!id) {
        if (method === "POST") {
          const newTicketId = `TKT${Date.now()}`;
          return { success: true, ticketId: newTicketId } as T;
        }
        return mockTickets as T;
      }
      if (action === "reply" && method === "POST") {
        return { success: true } as T;
      }
      return mockTickets.find((t) => t.id === id) as T;
    }

    // Departments (for ticket creation)
    if (resource === "departments") {
      return departments as T;
    }

    throw new Error(`Unknown endpoint: ${endpoint}`);
  },
};
