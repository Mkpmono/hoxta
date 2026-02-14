/**
 * WHMCS API Client
 * Handles all communication with WHMCS API
 * Credentials are stored as environment variables
 */

interface WhmcsCredentials {
  url: string;
  identifier: string;
  secret: string;
}

function getCredentials(): WhmcsCredentials {
  const url = Deno.env.get('WHMCS_API_URL');
  const identifier = Deno.env.get('WHMCS_API_IDENTIFIER');
  const secret = Deno.env.get('WHMCS_API_SECRET');

  if (!url || !identifier || !secret) {
    throw new Error('WHMCS credentials not configured');
  }

  return { url, identifier, secret };
}

export function isWhmcsConfigured(): boolean {
  try {
    getCredentials();
    return true;
  } catch {
    return false;
  }
}

export interface WhmcsResponse<T = unknown> {
  result: 'success' | 'error';
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export async function callWhmcsApi<T = unknown>(
  action: string,
  params: Record<string, string | number | boolean> = {}
): Promise<WhmcsResponse<T>> {
  const { url, identifier, secret } = getCredentials();

  const formData = new URLSearchParams();
  formData.append('identifier', identifier);
  formData.append('secret', secret);
  formData.append('action', action);
  formData.append('responsetype', 'json');
  
  for (const [key, value] of Object.entries(params)) {
    formData.append(key, String(value));
  }

  const apiUrl = `${url}/includes/api.php`;
  console.log(`[WHMCS] Calling: ${apiUrl} | Action: ${action}`);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  const responseText = await response.text();
  console.log(`[WHMCS] Status: ${response.status} | Response: ${responseText.substring(0, 500)}`);

  if (!response.ok) {
    throw new Error(`WHMCS API request failed: ${response.status} ${response.statusText} - ${responseText.substring(0, 200)}`);
  }

  const data = JSON.parse(responseText);
  return data as WhmcsResponse<T>;
}

// ============ AUTH ACTIONS ============

export interface ValidateLoginResult {
  userid: number;
  email: string;
  password: string;
}

export async function validateLogin(email: string, password: string): Promise<WhmcsResponse<ValidateLoginResult>> {
  return callWhmcsApi<ValidateLoginResult>('ValidateLogin', { email, password2: password });
}

export interface AddClientParams {
  firstname: string;
  lastname: string;
  email: string;
  address1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phonenumber?: string;
  password2: string;
  companyname?: string;
}

export interface AddClientResult {
  clientid: number;
  owner_user_id: number;
}

export async function addClient(params: AddClientParams): Promise<WhmcsResponse<AddClientResult>> {
  return callWhmcsApi<AddClientResult>('AddClient', params as unknown as Record<string, string>);
}

export async function getClientDetails(clientId: number): Promise<WhmcsResponse> {
  return callWhmcsApi('GetClientsDetails', { clientid: clientId, stats: true });
}

// ============ ORDER ACTIONS ============

export interface AddOrderParams {
  clientid: number;
  pid: number;
  billingcycle: string;
  paymentmethod?: string;
  promo?: string;
}

export interface AddOrderResult {
  orderid: number;
  invoiceid: number;
  productids: string;
  addonids: string;
  domainids: string;
}

export async function addOrder(params: AddOrderParams): Promise<WhmcsResponse<AddOrderResult>> {
  return callWhmcsApi<AddOrderResult>('AddOrder', params as unknown as Record<string, string | number>);
}

export async function getOrders(clientId: number, limit = 50): Promise<WhmcsResponse> {
  return callWhmcsApi('GetOrders', { userid: clientId, limitnum: limit });
}

// ============ SERVICE ACTIONS ============

export async function getClientsProducts(clientId: number): Promise<WhmcsResponse> {
  return callWhmcsApi('GetClientsProducts', { clientid: clientId });
}

export async function getClientsProductDetails(clientId: number, serviceId: number): Promise<WhmcsResponse> {
  return callWhmcsApi('GetClientsProducts', { clientid: clientId, serviceid: serviceId });
}

export async function moduleCommand(serviceId: number, command: string): Promise<WhmcsResponse> {
  return callWhmcsApi('ModuleCustom', { serviceid: serviceId, func_name: command });
}

// ============ INVOICE ACTIONS ============

export async function getInvoices(clientId: number, status?: string): Promise<WhmcsResponse> {
  const params: Record<string, string | number> = { userid: clientId, limitnum: 100 };
  if (status) params.status = status;
  return callWhmcsApi('GetInvoices', params);
}

export async function getInvoice(invoiceId: number): Promise<WhmcsResponse> {
  return callWhmcsApi('GetInvoice', { invoiceid: invoiceId });
}

export async function addInvoicePayment(
  invoiceId: number,
  transactionId: string,
  gateway: string,
  amount?: number
): Promise<WhmcsResponse> {
  const params: Record<string, string | number> = {
    invoiceid: invoiceId,
    transid: transactionId,
    gateway,
  };
  if (amount) params.amount = amount;
  return callWhmcsApi('AddInvoicePayment', params);
}

// ============ TICKET ACTIONS ============

export async function getTickets(clientId: number, status?: string): Promise<WhmcsResponse> {
  const params: Record<string, string | number> = { clientid: clientId, limitnum: 100 };
  if (status) params.status = status;
  return callWhmcsApi('GetTickets', params);
}

export async function getTicket(ticketId: number | string): Promise<WhmcsResponse> {
  return callWhmcsApi('GetTicket', { ticketid: ticketId });
}

export interface OpenTicketParams {
  clientid: number;
  deptid: number;
  subject: string;
  message: string;
  priority?: 'Low' | 'Medium' | 'High';
}

export async function openTicket(params: OpenTicketParams): Promise<WhmcsResponse> {
  return callWhmcsApi('OpenTicket', params as unknown as Record<string, string | number>);
}

export async function addTicketReply(ticketId: number, message: string, clientId?: number): Promise<WhmcsResponse> {
  const params: Record<string, string | number> = { ticketid: ticketId, message };
  if (clientId) params.clientid = clientId;
  return callWhmcsApi('AddTicketReply', params);
}
