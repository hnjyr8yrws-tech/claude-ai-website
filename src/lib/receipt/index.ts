// Audit Receipt module (Concept 3). HEAVY — always load via dynamic import.
export { ReceiptDocument, type ReceiptDocumentProps } from './ReceiptDocument';
export {
  generateReceiptBlob,
  downloadReceipt,
  validateReceiptModel,
  ReceiptRefusedError,
} from './generateReceipt';
export { registerReceiptFonts, PDF_COLOURS } from './fonts';
