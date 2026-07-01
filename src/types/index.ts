// ─────────────────────────────────────────────
//  AutoVault — Shared Type Definitions
// ─────────────────────────────────────────────

// ── Vehicle Fitment ───────────────────────────

export interface VehicleFitment {
  brand: string;
  model: string;
  year: string;
}

// ── Product ──────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  stock: number;
  buyPrice: number;   // owner-only
  sellPrice: number;
  lowStockThreshold: number;
  status?: "Active" | "Inactive" | "Discontinued";
  fitments?: VehicleFitment[];
  // Optional extended fields
  supplier?: string;
  hsn?: string;
  gst?: number;
  location?: string;
  description?: string;
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
}

// ── Invoice ───────────────────────────────────

export type PaymentMethod = "Cash" | "UPI" | "Card" | "Credit";
export type PaymentStatus = "Paid" | "Partial" | "Debt";

export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // sell price at time of sale
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string | null; // null = walk-in
  customer: string;
  customerPhone: string;
  vehicleNumber: string;
  vehicleModel: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  dueAmount: number;
  subtotal: number;
  discount: number; // percentage 0-100
  total: number;    // subtotal after discount
  notes: string;
  date: string;     // ISO date string
  createdAt?: string; // Full ISO timestamp
  items: InvoiceItem[];
  billedBy?: "Owner" | "Staff";
  voided?: boolean;
  voidedAt?: string;
  voidReason?: string;
}

// ── Customer ──────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  phone: string;
  debt: number;      // Derived cache — sum of open invoice dues
  totalSpent: number;
  visits: number;
  lastVisit: string; // ISO date string
  invoiceIds: string[];
}

// ── Debt Payment (Repayment Ledger) ──────────

export interface DebtPayment {
  id: string;
  customerId: string;
  invoiceId: string;   // always linked to a specific invoice
  amount: number;
  date: string;        // ISO date string
  method: PaymentMethod;
  note?: string;
  collectedBy: "Owner" | "Staff";
}

// ── Cart (used in Billing page) ───────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ── App Store State ───────────────────────────

export interface AppState {
  products: Product[];
  customers: Customer[];
  invoices: Invoice[];
  debtPayments: DebtPayment[];
}
