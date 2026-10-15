/**
 * Utilities for formatting Indian Rupee currency, dates in Asia/Kolkata timezone,
 * and Indian phone validation.
 */

export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKolkataDate(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatKolkataDateTime(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Validates 10-digit Indian mobile number (optionally with +91 or 0 prefix)
 */
export function validateIndianPhone(phone: string): { isValid: boolean; formatted: string; error?: string } {
  if (!phone || !phone.trim()) {
    return { isValid: false, formatted: '', error: 'Phone number is required.' };
  }
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  if (!match) {
    return {
      isValid: false,
      formatted: phone,
      error: 'Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).',
    };
  }
  return {
    isValid: true,
    formatted: `+91 ${match[1].slice(0, 5)} ${match[1].slice(5)}`,
  };
}

/**
 * Generates a public passport link
 */
export function getPassportUrl(applianceId: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/passport/${applianceId}`;
}
