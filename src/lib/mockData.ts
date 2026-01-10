// Centralized mock data for demo mode

export interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "admin" | "owner";
}

export interface Service {
  id: string;
  name: string;
  type: "game" | "vps" | "web" | "dedicated";
  status: "active" | "suspended" | "pending" | "cancelled";
  price: number;
  nextDue: string;
  ip?: string;
}

export interface Order {
  id: string;
  date: string;
  product: string;
  status: "pending" | "active" | "completed" | "cancelled";
  total: number;
  clientId?: string;
  clientName?: string;
}

export interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue" | "cancelled";
  total: number;
  items: { name: string; amount: number }[];
}

export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "answered" | "customer-reply" | "closed";
  priority: "low" | "medium" | "high";
  department: string;
  lastReply: string;
  createdAt: string;
  clientId?: string;
  clientName?: string;
  messages?: { sender: string; message: string; date: string }[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  services: number;
  totalSpent: number;
  joinedAt: string;
}

export const demoUsers: User[] = [
  { id: "1", email: "client@demo.hoxta", name: "Demo Client", role: "client" },
  { id: "2", email: "admin@demo.hoxta", name: "Demo Admin", role: "admin" },
  { id: "3", email: "owner@demo.hoxta", name: "Demo Owner", role: "owner" },
];

export const demoCredentials = {
  client: { email: "client@demo.hoxta", password: "Demo1234!" },
  admin: { email: "admin@demo.hoxta", password: "Demo1234!" },
  owner: { email: "owner@demo.hoxta", password: "Demo1234!" },
};

export const mockServices: Service[] = [
  { id: "SVC001", name: "Minecraft Server - Pro", type: "game", status: "active", price: 15.99, nextDue: "2026-02-10", ip: "45.12.34.56:25565" },
  { id: "SVC002", name: "VPS Standard", type: "vps", status: "active", price: 12.99, nextDue: "2026-02-05", ip: "45.12.34.57" },
  { id: "SVC003", name: "Web Hosting - Professional", type: "web", status: "active", price: 6.99, nextDue: "2026-02-15" },
  { id: "SVC004", name: "FiveM Server", type: "game", status: "pending", price: 29.99, nextDue: "2026-02-01" },
];

export const mockOrders: Order[] = [
  { id: "ORD001", date: "2026-01-08", product: "Minecraft Server - Pro", status: "completed", total: 15.99, clientId: "1", clientName: "Demo Client" },
  { id: "ORD002", date: "2026-01-05", product: "VPS Standard", status: "active", total: 12.99, clientId: "1", clientName: "Demo Client" },
  { id: "ORD003", date: "2026-01-03", product: "Web Hosting - Professional", status: "completed", total: 6.99, clientId: "3", clientName: "John Smith" },
  { id: "ORD004", date: "2026-01-01", product: "FiveM Server", status: "pending", total: 29.99, clientId: "4", clientName: "Gaming Corp" },
  { id: "ORD005", date: "2025-12-28", product: "Dedicated Server - E5", status: "completed", total: 149.00, clientId: "5", clientName: "Enterprise Ltd" },
];

export const mockInvoices: Invoice[] = [
  { id: "INV001", date: "2026-01-10", dueDate: "2026-02-10", status: "unpaid", total: 15.99, items: [{ name: "Minecraft Server - Pro (Monthly)", amount: 15.99 }] },
  { id: "INV002", date: "2026-01-05", dueDate: "2026-02-05", status: "paid", total: 12.99, items: [{ name: "VPS Standard (Monthly)", amount: 12.99 }] },
  { id: "INV003", date: "2025-12-15", dueDate: "2026-01-15", status: "paid", total: 6.99, items: [{ name: "Web Hosting - Professional (Monthly)", amount: 6.99 }] },
  { id: "INV004", date: "2025-12-01", dueDate: "2026-01-01", status: "overdue", total: 29.99, items: [{ name: "FiveM Server (Monthly)", amount: 29.99 }] },
];

export const mockTickets: Ticket[] = [
  { 
    id: "TKT001", 
    subject: "Server not starting", 
    status: "open", 
    priority: "high", 
    department: "Technical Support", 
    lastReply: "2026-01-10 14:30",
    createdAt: "2026-01-10 10:00",
    clientId: "1",
    clientName: "Demo Client",
    messages: [
      { sender: "Demo Client", message: "My Minecraft server won't start after the latest update. I get an error about Java version.", date: "2026-01-10 10:00" },
      { sender: "Support Team", message: "Thank you for reaching out. Could you please share the error log from your control panel?", date: "2026-01-10 14:30" },
    ]
  },
  { 
    id: "TKT002", 
    subject: "Upgrade VPS plan", 
    status: "answered", 
    priority: "medium", 
    department: "Sales", 
    lastReply: "2026-01-09 16:00",
    createdAt: "2026-01-09 09:00",
    clientId: "1",
    clientName: "Demo Client",
    messages: [
      { sender: "Demo Client", message: "I'd like to upgrade my VPS to the Pro plan. What's the process?", date: "2026-01-09 09:00" },
      { sender: "Support Team", message: "You can upgrade directly from your panel. Go to Services > Your VPS > Upgrade. The price difference will be prorated.", date: "2026-01-09 16:00" },
    ]
  },
  { 
    id: "TKT003", 
    subject: "Billing inquiry", 
    status: "closed", 
    priority: "low", 
    department: "Billing", 
    lastReply: "2026-01-05 11:00",
    createdAt: "2026-01-05 08:00",
    clientId: "3",
    clientName: "John Smith"
  },
  { 
    id: "TKT004", 
    subject: "DDoS attack on my server", 
    status: "customer-reply", 
    priority: "high", 
    department: "Technical Support", 
    lastReply: "2026-01-10 18:00",
    createdAt: "2026-01-10 17:00",
    clientId: "4",
    clientName: "Gaming Corp"
  },
];

export const mockClients: Client[] = [
  { id: "1", name: "Demo Client", email: "client@demo.hoxta", status: "active", services: 4, totalSpent: 245.87, joinedAt: "2025-06-15" },
  { id: "3", name: "John Smith", email: "john@example.com", status: "active", services: 2, totalSpent: 156.32, joinedAt: "2025-08-20" },
  { id: "4", name: "Gaming Corp", email: "billing@gamingcorp.com", status: "active", services: 5, totalSpent: 1250.00, joinedAt: "2025-03-10" },
  { id: "5", name: "Enterprise Ltd", email: "it@enterprise.com", status: "active", services: 3, totalSpent: 2890.00, joinedAt: "2024-11-05" },
  { id: "6", name: "Inactive User", email: "inactive@example.com", status: "inactive", services: 0, totalSpent: 45.00, joinedAt: "2025-01-01" },
];
