/**
 * WHMCS Client - re-exports from new API client
 * Backward compatibility layer
 */
export {
  apiClient as whmcsClient,
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
  openTicket,
  replyTicket,
} from "@/integrations/api/client";

export type {
  ClientDetails,
  Service,
  ServiceDetails,
  UpgradeOption,
  Order,
  Invoice,
  InvoiceItem,
  Ticket,
  TicketMessage,
} from "@/integrations/api/client";

// Legacy type aliases
export type CreateTicketPayload = {
  departmentId: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high";
  relatedServiceId?: string;
};

export type ReplyTicketPayload = {
  message: string;
  attachments?: File[];
};

export type CancellationPayload = {
  type: "immediate" | "end_of_billing";
  reason: string;
};
