/**
 * Input validation utilities for Edge Functions
 * Provides strict validation for all user inputs
 */

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Alphanumeric with common punctuation
const SAFE_TEXT_REGEX = /^[\w\s.,!?@#$%^&*()[\]{}:;'"<>\/\\|`~+=_-]*$/;

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: unknown;
}

/**
 * Validate email format
 */
export function validateEmail(email: unknown): ValidationResult {
  if (typeof email !== 'string') {
    return { valid: false, error: 'Email must be a string' };
  }
  
  const trimmed = email.trim().toLowerCase();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (trimmed.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' };
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true, sanitized: trimmed };
}

/**
 * Validate password strength
 */
export function validatePassword(password: unknown): ValidationResult {
  if (typeof password !== 'string') {
    return { valid: false, error: 'Password must be a string' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (password.length > 128) {
    return { valid: false, error: 'Password must be less than 128 characters' };
  }
  
  // Check for at least one uppercase, one lowercase, and one digit
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain a lowercase letter' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain an uppercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain a number' };
  }
  
  return { valid: true, sanitized: password };
}

/**
 * Validate a text field with length limits
 */
export function validateText(
  value: unknown,
  fieldName: string,
  options: { minLength?: number; maxLength?: number; required?: boolean } = {}
): ValidationResult {
  const { minLength = 0, maxLength = 1000, required = false } = options;
  
  if (value === undefined || value === null) {
    if (required) {
      return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true, sanitized: '' };
  }
  
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  
  const trimmed = value.trim();
  
  if (required && trimmed.length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  return { valid: true, sanitized: trimmed };
}

/**
 * Validate a numeric ID
 */
export function validateId(value: unknown, fieldName: string): ValidationResult {
  if (value === undefined || value === null) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  // Accept string or number
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
  
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (numValue < 1) {
    return { valid: false, error: `${fieldName} must be a positive number` };
  }
  
  if (numValue > Number.MAX_SAFE_INTEGER) {
    return { valid: false, error: `${fieldName} is too large` };
  }
  
  return { valid: true, sanitized: numValue };
}

/**
 * Validate an enum value
 */
export function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[],
  options: { required?: boolean; defaultValue?: T } = {}
): ValidationResult {
  const { required = false, defaultValue } = options;
  
  if (value === undefined || value === null) {
    if (required && !defaultValue) {
      return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true, sanitized: defaultValue || allowedValues[0] };
  }
  
  if (typeof value !== 'string') {
    return { valid: false, error: `${fieldName} must be a string` };
  }
  
  const normalized = value.toLowerCase().trim();
  
  if (!allowedValues.includes(normalized as T)) {
    return { 
      valid: false, 
      error: `${fieldName} must be one of: ${allowedValues.join(', ')}` 
    };
  }
  
  return { valid: true, sanitized: normalized };
}

/**
 * Validate a positive amount (for payments)
 */
export function validateAmount(value: unknown, fieldName = 'Amount'): ValidationResult {
  if (value === undefined || value === null) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (numValue <= 0) {
    return { valid: false, error: `${fieldName} must be positive` };
  }
  
  if (!isFinite(numValue)) {
    return { valid: false, error: `${fieldName} must be a finite number` };
  }
  
  // Round to 2 decimal places
  const rounded = Math.round(numValue * 100) / 100;
  
  return { valid: true, sanitized: rounded };
}

/**
 * Validate billing cycle
 */
const VALID_BILLING_CYCLES = ['monthly', 'quarterly', 'annually', 'yearly'] as const;
type BillingCycle = typeof VALID_BILLING_CYCLES[number];

export function validateBillingCycle(value: unknown): ValidationResult {
  return validateEnum(value, 'Billing cycle', VALID_BILLING_CYCLES, { 
    required: false, 
    defaultValue: 'monthly' 
  });
}

/**
 * Validate payment method
 */
const VALID_PAYMENT_METHODS = ['stripe', 'paypal', 'crypto', 'paysafe'] as const;
type PaymentMethod = typeof VALID_PAYMENT_METHODS[number];

export function validatePaymentMethod(value: unknown): ValidationResult {
  return validateEnum(value, 'Payment method', VALID_PAYMENT_METHODS, { 
    required: false, 
    defaultValue: 'stripe' 
  });
}

/**
 * Validate priority level
 */
const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;
type Priority = typeof VALID_PRIORITIES[number];

export function validatePriority(value: unknown): ValidationResult {
  return validateEnum(value, 'Priority', VALID_PRIORITIES, { 
    required: false, 
    defaultValue: 'medium' 
  });
}

/**
 * Validate cancellation type
 */
const VALID_CANCELLATION_TYPES = ['immediate', 'end_of_billing'] as const;
type CancellationType = typeof VALID_CANCELLATION_TYPES[number];

export function validateCancellationType(value: unknown): ValidationResult {
  return validateEnum(value, 'Cancellation type', VALID_CANCELLATION_TYPES, { 
    required: true 
  });
}

/**
 * Validate currency code
 */
const VALID_CURRENCIES = ['usd', 'eur', 'gbp', 'cad', 'aud'] as const;

export function validateCurrency(value: unknown): ValidationResult {
  return validateEnum(value, 'Currency', VALID_CURRENCIES, { 
    required: false, 
    defaultValue: 'usd' 
  });
}

/**
 * Sanitize text to prevent XSS
 * Removes HTML tags and encodes special characters
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Batch validate multiple fields
 */
export function validateAll(
  validations: Array<{ result: ValidationResult; fieldName: string }>
): { valid: boolean; errors: string[]; sanitized: Record<string, unknown> } {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};
  
  for (const { result, fieldName } of validations) {
    if (!result.valid && result.error) {
      errors.push(result.error);
    } else {
      sanitized[fieldName] = result.sanitized;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}
