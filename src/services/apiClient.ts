/**
 * Unified API Client - re-exports from new location
 * This file maintains backward compatibility for imports from @/services/apiClient
 */
export {
  apiClient,
  login,
  register,
  logout,
  me,
  getServices,
  getServiceDetails,
  getAvailableUpgrades,
  createUpgrade,
  requestCancellation,
  getOrders,
  createOrder,
  getInvoices,
  getInvoice,
  getInvoicePayLink,
  markInvoicePaid,
  getTickets,
  getTicket,
  getDepartments,
  openTicket,
  replyTicket,
  ApiError,
  AuthExpiredError,
} from "@/integrations/api/client";

export type {
  ClientDetails,
  LoginResponse,
  RegisterResponse,
  MeResponse,
  Service,
  ServiceDetails,
  UpgradeOption,
  Order,
  Invoice,
  InvoiceItem,
  Ticket,
  TicketMessage,
  Department,
} from "@/integrations/api/client";
