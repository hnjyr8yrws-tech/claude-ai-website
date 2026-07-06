// Audit Receipt module (Concept 3). HEAVY — always load via dynamic import.
// For gating WITHOUT the heavy chunk, import '@/lib/receipt/validate' directly.
export { ReceiptDocument, type ReceiptDocumentProps } from './ReceiptDocument';
export { generateReceiptBlob, downloadReceipt } from './generateReceipt';
export { validateReceiptModel, canGenerateReceipt, ReceiptRefusedError } from './validate';
export { registerReceiptFonts, PDF_COLOURS } from './fonts';
