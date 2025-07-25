import { FormData } from '../types';

const FORM_DATA_KEY = 'stockTransferData';
const PAYMENT_STATUS_KEY = 'stockTransferPaid';
const FORM_ID_KEY = 'stockTransferFormId';
const SESSION_ID_KEY = 'stockTransferSession';

export function saveFormDataToStorage(formData: FormData): void {
  const dataWithMetadata = {
    ...formData,
    _timestamp: Date.now(),
    _version: '1.0'
  };
  
  // Store in localStorage (persists between sessions)
  localStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataWithMetadata));
  
  // Also store in sessionStorage (more immediate access after redirect)
  sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataWithMetadata));
  
  // Create backup copy
  localStorage.setItem(FORM_DATA_KEY + '_backup', JSON.stringify(dataWithMetadata));
}

export function loadFormDataFromStorage(): FormData | null {
  try {
    // Try sessionStorage first (most immediate)
    let storedData = sessionStorage.getItem(FORM_DATA_KEY);
    
    // If not found, try localStorage
    if (!storedData) {
      storedData = localStorage.getItem(FORM_DATA_KEY);
    }
    
    // If still not found, try backup
    if (!storedData) {
      storedData = localStorage.getItem(FORM_DATA_KEY + '_backup');
    }
    
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Remove metadata fields
      const { _timestamp, _version, ...formData } = parsedData;
      return formData as FormData;
    }
  } catch (error) {
    console.error('Error loading form data from storage:', error);
  }
  
  return null;
}

export function savePaymentStatus(isPaid: boolean, transactionId?: string): void {
  localStorage.setItem(PAYMENT_STATUS_KEY, isPaid.toString());
  if (transactionId) {
    localStorage.setItem('stockTransferTransactionId', transactionId);
  }
}

export function loadPaymentStatus(): { isPaid: boolean; transactionId?: string } {
  const isPaid = localStorage.getItem(PAYMENT_STATUS_KEY) === 'true';
  const transactionId = localStorage.getItem('stockTransferTransactionId') || undefined;
  return { isPaid, transactionId };
}

export function clearAllStoredData(): void {
  localStorage.removeItem(FORM_DATA_KEY);
  localStorage.removeItem(FORM_DATA_KEY + '_backup');
  localStorage.removeItem(PAYMENT_STATUS_KEY);
  localStorage.removeItem('stockTransferTransactionId');
  localStorage.removeItem(FORM_ID_KEY);
  
  sessionStorage.removeItem(FORM_DATA_KEY);
  sessionStorage.removeItem(SESSION_ID_KEY);
}

export function saveFormId(formId: string): void {
  localStorage.setItem(FORM_ID_KEY, formId);
  sessionStorage.setItem('temp_form_id', formId);
}

export function loadFormId(): string | null {
  return localStorage.getItem(FORM_ID_KEY) || sessionStorage.getItem('temp_form_id');
}