"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import { useStore } from "@/lib/store";
import { useRole } from "@/hooks/useRole";
import type { Product, VehicleFitment } from "@/types";
import {
  Search,
  Plus,
  Pencil,
  X,
  Package,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Upload,
  Download,
  TrendingUp,
  Activity,
  Info,
  CheckCircle2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
//  CATEGORIES derived from store data
// ─────────────────────────────────────────────────────────────────────────────

const STOCK_FILTERS = ["All", "Low Stock", "Out of Stock"] as const;
type StockFilter = (typeof STOCK_FILTERS)[number];

// ─────────────────────────────────────────────────────────────────────────────
//  EMPTY PRODUCT FORM
// ─────────────────────────────────────────────────────────────────────────────

const PRODUCT_STATUSES = ["Active", "Inactive", "Discontinued"] as const;
type ProductStatus = (typeof PRODUCT_STATUSES)[number];

const SKU_REGEX = /^[A-Za-z0-9_-]{3,40}$/;

const EMPTY_FORM = {
  name: "",
  sku: "",
  brand: "",
  category: "",
  status: "Active" as ProductStatus,
  stock: 0,
  buyPrice: 0,
  sellPrice: 0,
  lowStockThreshold: 5,
  fitments: [] as VehicleFitment[],
};

type ProductForm = typeof EMPTY_FORM;

// ─────────────────────────────────────────────────────────────────────────────
//  INVENTORY PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const { state, addProduct, updateProduct, adjustStock, getInventoryValue, showToast } =
    useStore();
  const { isOwner, loading } = useRole();

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState<StockFilter>("All");

  // ── Modal: Add / Edit Product ─────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formWarning, setFormWarning] = useState("");

  // ── Modal subform: Fitments ───────────────────────────────────────────────
  const [newFitBrand, setNewFitBrand] = useState("");
  const [newFitModel, setNewFitModel] = useState("");
  const [newFitYear, setNewFitYear] = useState("");

  // ── Modal: Adjust Stock ───────────────────────────────────────────────────
  const [stockModal, setStockModal] = useState<Product | null>(null);
  const [stockDelta, setStockDelta] = useState("");

  // ── Expandable Product Row State ──────────────────────────────────────────
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(state.products.map((p) => p.category))
    ).sort();
    return ["All", ...cats];
  }, [state.products]);

  const stats = useMemo(() => {
    const ps = state.products;
    return {
      total: ps.length,
      totalUnits: ps.reduce((s, p) => s + p.stock, 0),
      lowStock: ps.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold)
        .length,
      outOfStock: ps.filter((p) => p.stock === 0).length,
      value: getInventoryValue(),
    };
  }, [state.products, getInventoryValue]);

  // ── Dynamic Insights ──────────────────────────────────────────────────────
  const insights = useMemo(() => {
    const ps = state.products;
    const total = ps.length;
    if (total === 0) {
      return {
        healthScore: 100,
        topCategory: "None",
        topCategoryValue: 0,
        topProduct: null,
        topProductValue: 0,
        criticalCount: 0,
        highestMarginProduct: null,
      };
    }

    const lowStockCount = ps.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const outOfStockCount = ps.filter((p) => p.stock === 0).length;
    const healthScore = Math.max(
      0,
      Math.round(((total - outOfStockCount - lowStockCount * 0.5) / total) * 100)
    );

    // Calculate value per category
    const catValues: { [cat: string]: number } = {};
    const catUnits: { [cat: string]: number } = {};
    ps.forEach((p) => {
      catValues[p.category] = (catValues[p.category] || 0) + p.stock * p.buyPrice;
      catUnits[p.category] = (catUnits[p.category] || 0) + p.stock;
    });

    let topCategory = "None";
    let topCategoryVal = 0;
    Object.entries(catValues).forEach(([cat, val]) => {
      if (val > topCategoryVal) {
        topCategoryVal = val;
        topCategory = cat;
      }
    });
    if (topCategory === "None" && Object.keys(catUnits).length > 0) {
      let maxUnits = 0;
      Object.entries(catUnits).forEach(([cat, units]) => {
        if (units > maxUnits) {
          maxUnits = units;
          topCategory = cat;
        }
      });
    }

    // Top capital product (by stock * buyPrice)
    let topProduct: Product | null = null;
    let topProductVal = -1;
    for (const p of ps) {
      const val = p.stock * p.buyPrice;
      if (val > topProductVal) {
        topProductVal = val;
        topProduct = p;
      }
    }

    if ((!topProduct || topProductVal === 0) && ps.length > 0) {
      let maxStock = -1;
      for (const p of ps) {
        if (p.stock > maxStock) {
          maxStock = p.stock;
          topProduct = p;
        }
      }
      topProductVal = topProduct?.stock || 0;
    }

    // Highest margin product
    let highestMarginProduct: Product | null = null;
    let maxMargin = -1000;
    for (const p of ps) {
      if (p.sellPrice > 0) {
        const margin = ((p.sellPrice - p.buyPrice) / p.sellPrice) * 100;
        if (margin > maxMargin) {
          maxMargin = margin;
          highestMarginProduct = p;
        }
      }
    }

    return {
      healthScore,
      topCategory,
      topCategoryValue: topCategoryVal,
      topProduct,
      topProductValue: topProductVal,
      criticalCount: outOfStockCount + lowStockCount,
      highestMarginProduct,
    };
  }, [state.products]);

  const filtered = useMemo(() => {
    let list = [...state.products];

    // Category
    if (categoryFilter !== "All") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    // Stock filter
    if (stockFilter === "Low Stock") {
      list = list.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    } else if (stockFilter === "Out of Stock") {
      list = list.filter((p) => p.stock === 0);
    }
    // Search
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    return list;
  }, [state.products, categoryFilter, stockFilter, search]);

  // ── Open Add modal ────────────────────────────────────────────────────────
  function openAddModal() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFormWarning("");
    setNewFitBrand("");
    setNewFitModel("");
    setNewFitYear("");
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      status: (product.status as ProductStatus) || "Active",
      stock: product.stock,
      buyPrice: product.buyPrice,
      sellPrice: product.sellPrice,
      lowStockThreshold: product.lowStockThreshold,
      fitments: product.fitments || [],
    });
    setFormError("");
    setFormWarning("");
    setNewFitBrand("");
    setNewFitModel("");
    setNewFitYear("");
    setShowModal(true);
  }

  // ── Save (add or update) ──────────────────────────────────────────────────
  function handleSave() {
    setFormError("");
    setFormWarning("");

    // ── Name ──────────────────────────────────────────────────────────────────
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setFormError("Product name is required.");
      return;
    }
    if (trimmedName.length < 3) {
      setFormError("Product name must be at least 3 characters.");
      return;
    }
    if (trimmedName.length > 100) {
      setFormError("Product name must not exceed 100 characters.");
      return;
    }

    // ── SKU ───────────────────────────────────────────────────────────────────
    const trimmedSku = form.sku.trim();
    if (!trimmedSku) {
      setFormError("SKU is required.");
      return;
    }
    if (!SKU_REGEX.test(trimmedSku)) {
      setFormError(
        "SKU must be 3–40 characters and contain only letters, numbers, hyphens (-), or underscores (_)."
      );
      return;
    }

    // ── Prices ────────────────────────────────────────────────────────────────
    if (form.buyPrice < 0) {
      setFormError("Buy price cannot be negative.");
      return;
    }
    if (form.sellPrice < 0) {
      setFormError("Sell price cannot be negative.");
      return;
    }

    // ── Stock / Threshold ─────────────────────────────────────────────────────
    if (!Number.isInteger(form.stock) || form.stock < 0) {
      setFormError("Stock must be a whole number (0 or more).");
      return;
    }
    if (!Number.isInteger(form.lowStockThreshold) || form.lowStockThreshold < 1) {
      setFormError("Low stock threshold must be a whole number of at least 1.");
      return;
    }

    // ── Duplicate SKU ─────────────────────────────────────────────────────────
    const duplicateSKU = state.products.find(
      (p) =>
        p.sku.trim().toLowerCase() === trimmedSku.toLowerCase() &&
        (!editingProduct || p.id !== editingProduct.id)
    );
    if (duplicateSKU) {
      setFormError(
        `SKU "${trimmedSku}" is already used by "${duplicateSKU.name}". SKU must be unique.`
      );
      return;
    }

    // ── Sell < Buy warning (non-blocking) ─────────────────────────────────────
    if (form.sellPrice > 0 && form.sellPrice < form.buyPrice) {
      setFormWarning(
        `Warning: Sell Price (₹${form.sellPrice}) is less than Buy Price (₹${form.buyPrice}). This product will be sold at a loss.`
      );
      // Do NOT return — allow save to proceed.
    }

    // ── Persist ───────────────────────────────────────────────────────────────
    try {
      if (editingProduct) {
        updateProduct({ ...editingProduct, ...form, name: trimmedName, sku: editingProduct.sku });
        showToast(`"${trimmedName}" updated successfully.`, "success");
      } else {
        addProduct({ ...form, name: trimmedName, sku: trimmedSku });
        showToast(`"${trimmedName}" added successfully.`, "success");
      }
      setShowModal(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      setFormError(msg);
    }
  }

  // ── Stock adjustment ──────────────────────────────────────────────────────
  function handleStockAdjust(direction: "add" | "remove") {
    if (!stockModal) return;
    const delta = Number(stockDelta);
    if (isNaN(delta) || delta <= 0 || !Number.isInteger(delta)) {
      showToast("Please enter a valid positive whole number.", "error");
      return;
    }
    if (direction === "remove" && delta > stockModal.stock) {
      showToast(`Cannot adjust stock down by ${delta}. Only ${stockModal.stock} units available.`, "error");
      return;
    }
    try {
      adjustStock(stockModal.id, direction === "add" ? delta : -delta);
      showToast(`Adjusted stock for "${stockModal.name}" successfully!`, "success");
      setStockModal(null);
      setStockDelta("");
    } catch (err) {
      showToast("Failed to adjust stock.", "error");
    }
  }

  // ── Field helper ──────────────────────────────────────────────────────────
  function setField<K extends keyof ProductForm>(key: K, val: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setFormError("");
    setFormWarning("");
  }

  // ── Import / Export CSV ───────────────────────────────────────────────────
  function handleExportCSV() {
    const headers = [
      "Name",
      "SKU",
      "Brand",
      "Category",
      "Stock",
      "Buy Price",
      "Sell Price",
      "Low Stock Threshold",
      "Compatible Vehicles"
    ];

    const rows = state.products.map((p) => {
      const fitmentString = (p.fitments || [])
        .map((f) => `${f.brand} ${f.model} ${f.year}`)
        .join("; ");

      const escape = (val: string | number) => {
        const text = String(val);
        if (text.includes(",") || text.includes('"') || text.includes("\n")) {
          return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
      };

      return [
        escape(p.name),
        escape(p.sku),
        escape(p.brand),
        escape(p.category),
        p.stock,
        p.buyPrice,
        p.sellPrice,
        p.lowStockThreshold,
        escape(fitmentString)
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "autovault_inventory.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cell.trim());
        cell = "";
      } else {
        cell += c;
      }
    }
    result.push(cell.trim());
    return result;
  }

  function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let text = event.target?.result as string;
      if (!text) return;

      // Strip UTF-8 BOM if present
      if (text.startsWith("\uFEFF")) {
        text = text.substring(1);
      }

      const lines: string[] = [];
      let currentLine = "";
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          inQuotes = !inQuotes;
          currentLine += char;
        } else if (char === "\n" && !inQuotes) {
          lines.push(currentLine.trim());
          currentLine = "";
        } else if (char === "\r") {
          // ignore
        } else {
          currentLine += char;
        }
      }
      if (currentLine) {
        lines.push(currentLine.trim());
      }

      if (lines.length === 0) {
        alert("Empty or invalid CSV file.");
        return;
      }

      const firstRowCells = parseCSVLine(lines[0]);
      const headers = firstRowCells.map((h) => h.toLowerCase());

      const findHeaderIndex = (aliases: string[]) => {
        for (const alias of aliases) {
          const idx = headers.indexOf(alias.toLowerCase());
          if (idx !== -1) return idx;
        }
        return -1;
      };

      let idxName = findHeaderIndex(["name", "product name", "product", "title"]);
      let idxSKU = findHeaderIndex(["sku", "sku code", "code", "item code"]);
      let idxBrand = findHeaderIndex(["brand", "make", "manufacturer"]);
      let idxCategory = findHeaderIndex(["category", "type", "group"]);
      let idxStock = findHeaderIndex(["stock", "qty", "quantity", "units", "count"]);
      let idxBuy = findHeaderIndex(["buy price", "buy", "cost", "purchase price", "cost price", "buyprice"]);
      let idxSell = findHeaderIndex(["sell price", "sell", "price", "selling price", "rate", "sellprice"]);
      let idxThreshold = findHeaderIndex(["low stock threshold", "threshold", "low stock", "alert qty", "alert"]);
      let idxFitments = findHeaderIndex(["compatible vehicles", "compatibility", "vehicles", "fitment", "fitments", "cars"]);

      let hasHeaders = true;
      let startRowIdx = 1;

      // If key columns are not found, check if it's a headerless CSV matching our standard positions
      if (idxName === -1 || idxSKU === -1 || idxSell === -1) {
        const looksLikeData = firstRowCells.length >= 2;
        if (looksLikeData) {
          hasHeaders = false;
          startRowIdx = 0;
          idxName = 0;
          idxSKU = 1;
          idxBrand = 2;
          idxCategory = 3;
          idxStock = 4;
          idxBuy = 5;
          idxSell = 6;
          idxThreshold = 7;
          idxFitments = 8;
        } else {
          alert("CSV must contain columns matching 'Name', 'SKU', and 'Sell Price', or be structured in standard order.");
          return;
        }
      }

      let importedCount = 0;
      let duplicateCount = 0;
      let invalidCount = 0;

      const cleanNumber = (val: string) => {
        if (!val) return 0;
        const clean = val.replace(/[₹$,\s]/g, "");
        return Number(clean) || 0;
      };

      for (let i = startRowIdx; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        const cells = parseCSVLine(line);

        const sku = cells[idxSKU] || "";
        const name = cells[idxName] || "";

        if (!sku || !name) {
          invalidCount++;
          continue;
        }

        const brand = idxBrand !== -1 ? cells[idxBrand] || "" : "";
        const category = idxCategory !== -1 ? cells[idxCategory] || "" : "";
        const stock = idxStock !== -1 ? cleanNumber(cells[idxStock]) : 0;
        const buyPrice = idxBuy !== -1 ? cleanNumber(cells[idxBuy]) : 0;
        const sellPrice = idxSell !== -1 ? cleanNumber(cells[idxSell]) : 0;
        const lowStockThreshold = idxThreshold !== -1 ? cleanNumber(cells[idxThreshold]) || 5 : 5;

        const fitmentsRaw = idxFitments !== -1 ? cells[idxFitments] || "" : "";
        const fitments: VehicleFitment[] = [];
        if (fitmentsRaw) {
          fitmentsRaw.split(";").forEach((item) => {
            const trimmed = item.trim();
            if (!trimmed) return;
            const parts = trimmed.split(" ");
            if (parts.length >= 3) {
              const year = parts[parts.length - 1];
              const brand = parts[0];
              const model = parts.slice(1, parts.length - 1).join(" ");
              fitments.push({ brand, model, year });
            } else if (parts.length === 2) {
              fitments.push({ brand: parts[0], model: parts[1], year: "—" });
            }
          });
        }

        // ── SKU format check ──────────────────────────────────────────────
        if (!SKU_REGEX.test(sku.trim())) {
          showToast(
            `Row skipped: SKU "${sku}" contains invalid characters or wrong length (3–40 chars, alphanumeric/hyphen/underscore only).`,
            "error"
          );
          invalidCount++;
          continue;
        }

        const duplicate = state.products.find(
          (p) => p.sku.trim().toLowerCase() === sku.trim().toLowerCase()
        );

        if (duplicate) {
          showToast(
            `Row skipped: SKU "${sku}" already exists for "${duplicate.name}". Duplicate SKU rejected.`,
            "error"
          );
          duplicateCount++;
          continue;
        }

        // ── Status: validate, default Active ─────────────────────────────
        let idxStatus = -1;
        const headersCopy = firstRowCells.map((h) => h.toLowerCase());
        for (const alias of ["status", "product status", "state"]) {
          const idx = headersCopy.indexOf(alias);
          if (idx !== -1) { idxStatus = idx; break; }
        }
        let importStatus: "Active" | "Inactive" | "Discontinued" = "Active";
        if (idxStatus !== -1 && cells[idxStatus]) {
          const rawStatus = cells[idxStatus].trim();
          if (["Active", "Inactive", "Discontinued"].includes(rawStatus)) {
            importStatus = rawStatus as "Active" | "Inactive" | "Discontinued";
          } else {
            showToast(
              `Row "${name}": Invalid status "${rawStatus}" — defaulting to Active.`,
              "error"
            );
          }
        }

        addProduct({
          name,
          sku,
          brand,
          category,
          status: importStatus,
          stock,
          buyPrice,
          sellPrice,
          lowStockThreshold,
          fitments,
        });

        importedCount++;
      }

      alert(
        `Import completed successfully!\n\nSummary:\n- Successfully Imported: ${importedCount} products\n- Skipped (Duplicate SKU): ${duplicateCount}\n- Skipped (Invalid SKU/Name): ${invalidCount}`
      );
      e.target.value = "";
    };
    reader.readAsText(file);
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
      <div>
        {/* Hidden file input for CSV Import */}
        <input
          type="file"
          id="csv-import-input"
          accept=".csv"
          onChange={handleImportCSV}
          className="hidden"
        />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-navy-950">Inventory</h1>
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => document.getElementById("csv-import-input")?.click()}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                <Upload size={14} />
                Import CSV
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                <Download size={14} />
                Export CSV
              </button>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-navy-950 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Plus size={15} />
                Add Product
              </button>
            </div>
          )}
        </div>

        {/* ── Stat Cards & Inventory Value Grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${isOwner ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <StatCard
              label="Total Products"
              value={stats.total}
              icon={<Package size={16} />}
              iconBg="bg-slate-100 text-slate-600"
            />
            <StatCard
              label="Total Units"
              value={stats.totalUnits}
              icon={<Package size={16} />}
              iconBg="bg-blue-50 text-blue-600"
            />
            <StatCard
              label="Low Stock"
              value={stats.lowStock}
              icon={<AlertTriangle size={16} />}
              iconBg="bg-orange-50 text-orange-500"
              valueClass="text-orange-600"
            />
            <StatCard
              label="Out of Stock"
              value={stats.outOfStock}
              icon={<AlertCircle size={16} />}
              iconBg="bg-red-50 text-red-500"
              valueClass="text-red-600"
            />
          </div>
          {isOwner && (
            <div className="lg:col-span-1 bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden border border-navy-800">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-navy-800 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute right-4 top-4">
                <DollarSign size={24} className="text-yellow-400 opacity-30" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-navy-300 font-semibold mb-1">Inventory Valuation</p>
                <p className="text-2xl font-extrabold tracking-tight text-yellow-400">
                  ₹{stats.value.toLocaleString()}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-navy-800 flex items-center justify-between text-[11px] text-navy-300">
                <span>Capital Invested</span>
                <span className="font-medium text-yellow-400">Buy Cost</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Inventory Health Insights Strip ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
            <Activity size={16} className="text-navy-600" />
            <h2 className="text-sm font-semibold text-slate-800">Operations Control Room</h2>
            <span className="ml-auto text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">Real-Time Indicators</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">

            {/* Health Index */}
            <div className="flex items-center gap-4 py-2 md:py-0 md:pr-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${insights.healthScore >= 90 ? 'bg-emerald-50 text-emerald-600' :
                insights.healthScore >= 70 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                <span className="text-base font-bold">{insights.healthScore}%</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Stock Health Index</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {insights.healthScore >= 90 ? 'Excellent item availability' :
                    insights.healthScore >= 70 ? 'Minor replenishment needed' : 'Immediate stockouts risk'}
                </p>
              </div>
            </div>

            {/* Allocation */}
            <div className="flex items-center gap-4 py-3 md:py-0 md:px-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <TrendingUp size={18} />
              </div>
              <div className="text-xs leading-normal">
                <p className="font-semibold text-slate-700">Primary Capital Focus</p>
                {isOwner ? (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Top Category: <span className="font-medium text-slate-700">{insights.topCategory}</span> (₹{insights.topCategoryValue.toLocaleString()})
                    {insights.topProduct && (
                      <>
                        <br />Top SKU: <span className="font-medium text-slate-700">{insights.topProduct.sku}</span> (₹{insights.topProductValue.toLocaleString()})
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Top Category: <span className="font-medium text-slate-700">{insights.topCategory}</span>
                    {insights.topProduct && (
                      <>
                        <br />Max Stock: <span className="font-medium text-slate-700">{insights.topProduct.sku}</span> ({insights.topProductValue} units)
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Priorities */}
            <div className="flex items-center gap-4 py-2 md:py-0 md:pl-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${insights.criticalCount > 0 ? 'bg-orange-50 text-orange-500 animate-pulse' : 'bg-slate-50 text-slate-400'
                }`}>
                <AlertTriangle size={18} />
              </div>
              <div className="text-xs shrink-0 flex-1">
                <p className="font-semibold text-slate-700">Restock Priority Actions</p>
                <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-1.5 items-center">
                  {insights.criticalCount === 0 ? (
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 size={12} /> All products healthy
                    </span>
                  ) : (
                    <>
                      <span className="text-orange-600 font-semibold">{insights.criticalCount} item{insights.criticalCount > 1 ? 's' : ''} need attention.</span>
                      <button
                        onClick={() => setStockFilter("Low Stock")}
                        className="text-[10px] text-navy-600 font-bold hover:underline cursor-pointer"
                      >
                        Filter list
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Search + Filters ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 mb-1">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search name, SKU, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap text-xs font-medium">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${categoryFilter === c
                    ? "bg-navy-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Stock filter */}
            <div className="ml-auto flex gap-2 text-xs font-medium">
              {STOCK_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStockFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${stockFilter === f
                    ? f === "Out of Stock"
                      ? "bg-red-600 text-white"
                      : f === "Low Stock"
                        ? "bg-orange-500 text-white"
                        : "bg-navy-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Table ──────────────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            state.products.length === 0 ? (
              <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                <Package size={40} className="text-slate-350 mx-auto mb-3" />
                <p className="text-slate-450 text-base font-bold">Warehouse is empty</p>
                <p className="text-slate-350 text-xs mt-1 max-w-sm mx-auto">There are no products in the catalog. Add products to start managing stock and billing sales.</p>
                {isOwner && (
                  <button
                    onClick={openAddModal}
                    className="mt-4 inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-navy-950 text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                  >
                    <Plus size={14} />
                    Add First Product
                  </button>
                )}
              </div>
            ) : (
              <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                <Search size={40} className="text-slate-350 mx-auto mb-3" />
                <p className="text-slate-400 text-sm font-bold">No products match filters</p>
                <p className="text-slate-350 text-xs mt-1 max-w-xs mx-auto">Try clearing search text or resetting the category and stock filters.</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setStockFilter("All");
                  }}
                  className="mt-4 text-xs font-bold text-amber-500 hover:text-amber-600 underline cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <th className="px-5 py-3 text-left font-medium">Product</th>
                    <th className="px-5 py-3 text-left font-medium hidden md:table-cell">SKU</th>
                    <th className="px-5 py-3 text-left font-medium hidden lg:table-cell">Brand</th>
                    <th className="px-5 py-3 text-left font-medium hidden lg:table-cell">Category</th>
                    <th className="px-5 py-3 text-center font-medium">Stock</th>
                    {isOwner && (
                      <th className="px-5 py-3 text-right font-medium">Buy ₹</th>
                    )}
                    <th className="px-5 py-3 text-right font-medium">Sell ₹</th>
                    {isOwner && (
                      <th className="px-5 py-3 text-right font-medium hidden md:table-cell">Margin</th>
                    )}
                    <th className="px-5 py-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((product) => {
                    const outOfStock = product.stock === 0;
                    const lowStock =
                      !outOfStock && product.stock <= product.lowStockThreshold;
                    const margin = isOwner
                      ? Math.round(
                        ((product.sellPrice - product.buyPrice) /
                          product.sellPrice) *
                        100
                      )
                      : 0;

                    const isExpanded = expandedProductId === product.id;

                    // Row highlights based on stock status
                    let borderLeftClass = "border-l-4 border-l-transparent";
                    let rowBgClass = "hover:bg-slate-50/80";
                    if (outOfStock) {
                      rowBgClass = "bg-red-50/10 hover:bg-red-50/20";
                      borderLeftClass = "border-l-4 border-l-red-500";
                    } else if (lowStock) {
                      rowBgClass = "bg-orange-50/10 hover:bg-orange-50/20";
                      borderLeftClass = "border-l-4 border-l-orange-500";
                    } else {
                      borderLeftClass = "border-l-4 border-l-emerald-500";
                    }

                    if (isExpanded) {
                      rowBgClass = "bg-slate-50/60";
                    }

                    return (
                      <Fragment key={product.id}>
                        <tr
                          className={`transition-colors border-b border-slate-100 ${borderLeftClass} ${rowBgClass}`}
                        >
                          {/* Product name */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedProductId(
                                    expandedProductId === product.id ? null : product.id
                                  );
                                }}
                                className="p-1 hover:bg-slate-200/80 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                                title="Toggle Details"
                              >
                                {expandedProductId === product.id ? (
                                  <ChevronUp size={15} />
                                ) : (
                                  <ChevronRight size={15} />
                                )}
                              </button>
                              <div>
                                <div
                                  className="font-semibold text-slate-800 hover:text-navy-600 transition-colors cursor-pointer"
                                  onClick={() => setExpandedProductId(
                                    expandedProductId === product.id ? null : product.id
                                  )}
                                >
                                  {product.name}
                                </div>
                                <div className="flex gap-1.5 mt-1">
                                  {outOfStock && (
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-red-50 text-red-650 border border-red-200 px-2 py-0.5 rounded">
                                      Out of Stock
                                    </span>
                                  )}
                                  {lowStock && (
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-orange-50 text-orange-650 border border-orange-200 px-2 py-0.5 rounded">
                                      Low Stock ({product.stock})
                                    </span>
                                  )}
                                  {!outOfStock && !lowStock && (
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-emerald-50/80 text-emerald-750 border border-emerald-200 px-2 py-0.5 rounded">
                                      Healthy
                                    </span>
                                  )}
                                  {/* Product Status badge */}
                                  {(product.status || "Active") === "Active" ? (
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-blue-50 text-blue-650 border border-blue-200 px-2 py-0.5 rounded">
                                      Active
                                    </span>
                                  ) : (product.status === "Inactive") ? (
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-slate-100 text-slate-600 border border-slate-250 px-2 py-0.5 rounded">
                                      Inactive
                                    </span>
                                  ) : (
                                    <span className="text-[9px] uppercase tracking-wider font-extrabold bg-amber-50 text-amber-700 border border-amber-250 px-2 py-0.5 rounded">
                                      Discontinued
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className="font-mono text-xs text-slate-650 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded select-all">
                              {product.sku}
                            </span>
                          </td>

                          {/* Brand */}
                          <td className="px-5 py-3.5 text-slate-700 font-semibold hidden lg:table-cell">
                            {product.brand || "—"}
                          </td>

                          {/* Category */}
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <span className="text-xs bg-slate-100 border border-slate-200 text-slate-650 px-2.5 py-1 rounded-md font-medium">
                              {product.category}
                            </span>
                          </td>

                          {/* Stock */}
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block font-bold px-2 py-0.5 rounded text-xs ${outOfStock
                                ? "bg-red-50 text-red-650 border border-red-200"
                                : lowStock
                                  ? "bg-orange-50 text-orange-650 border border-orange-200"
                                  : "bg-slate-55 text-slate-800"
                                }`}
                            >
                              {product.stock}
                            </span>
                          </td>

                          {/* Buy price (owner only) */}
                          {isOwner && (
                            <td className="px-5 py-3.5 text-right font-medium text-slate-500">
                              ₹{product.buyPrice.toLocaleString()}
                            </td>
                          )}

                          {/* Sell price */}
                          <td className="px-5 py-3.5 text-right font-bold text-slate-800">
                            ₹{product.sellPrice.toLocaleString()}
                          </td>

                          {/* Margin (owner only) */}
                          {isOwner && (
                            <td className="px-5 py-3.5 text-right hidden md:table-cell">
                              <span
                                className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${margin >= 30
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : margin >= 15
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                  }`}
                              >
                                {margin}%
                              </span>
                            </td>
                          )}

                          {/* Actions */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Stock adjust (owner only) */}
                              {isOwner && (
                                <button
                                  onClick={() => {
                                    setStockModal(product);
                                    setStockDelta("");
                                  }}
                                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                                >
                                  Stock
                                </button>
                              )}

                              {/* Edit (owner only) */}
                              {isOwner && (
                                <button
                                  onClick={() => openEditModal(product)}
                                  className="text-xs bg-navy-950 hover:bg-navy-800 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                                >
                                  <Pencil size={11} />
                                  Edit
                                </button>
                              )}
                              {/* Staff: view-only indicator */}
                              {!isOwner && (
                                <span className="text-[10px] text-slate-400 font-medium italic px-2">
                                  View only
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Details Pane */}
                        {isExpanded && (
                          <tr className={`${borderLeftClass} bg-slate-50/30`}>
                            <td colSpan={isOwner ? 9 : 7} className="px-6 py-5 border-t border-b border-slate-200/50">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Column 1: Vehicle Compatibility */}
                                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                      <Info size={14} className="text-slate-500" />
                                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Vehicle Compatibility</h4>
                                    </div>
                                    <div className="max-h-36 overflow-y-auto">
                                      {!product.fitments || product.fitments.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">
                                          Universal Fitment (Fits all vehicle makes & models)
                                        </p>
                                      ) : (
                                        <div className="flex flex-wrap gap-1.5 p-0.5">
                                          {product.fitments.map((fit, idx) => (
                                            <span
                                              key={idx}
                                              className="bg-amber-50/60 text-amber-800 border border-amber-200/80 text-[10px] font-semibold px-2 py-0.5 rounded"
                                            >
                                              {fit.brand} {fit.model} ({fit.year})
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-50 italic">
                                    * Fitments match against sales invoicing checklist.
                                  </div>
                                </div>

                                {/* Column 2: Recent Stock Movement Activity */}
                                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                      <Activity size={14} className="text-slate-500" />
                                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recent Activity Ledger</h4>
                                    </div>
                                    <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                                      <div className="flex items-start gap-2.5 text-xs">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                                        <div className="flex-1">
                                          <p className="text-slate-700 text-[11px] font-semibold leading-tight">Stock adjustment manually performed</p>
                                          <span className="text-[10px] text-slate-400">June 20, 2026</span>
                                        </div>
                                        <span className="text-[11px] font-extrabold text-emerald-600 font-mono">+10 units</span>
                                      </div>
                                      <div className="flex items-start gap-2.5 text-xs">
                                        <div className="w-1.5 h-1.5 rounded-full bg-navy-500 mt-1.5"></div>
                                        <div className="flex-1">
                                          <p className="text-slate-700 text-[11px] font-semibold leading-tight">Invoice INV-2026-004 checkout</p>
                                          <span className="text-[10px] text-slate-400">June 18, 2026</span>
                                        </div>
                                        <span className="text-[11px] font-extrabold text-navy-600 font-mono">-2 units</span>
                                      </div>
                                      <div className="flex items-start gap-2.5 text-xs">
                                        <div className="w-1.5 h-1.5 rounded-full bg-navy-500 mt-1.5"></div>
                                        <div className="flex-1">
                                          <p className="text-slate-700 text-[11px] font-semibold leading-tight">Invoice INV-2026-001 checkout</p>
                                          <span className="text-[10px] text-slate-400">June 12, 2026</span>
                                        </div>
                                        <span className="text-[11px] font-extrabold text-navy-600 font-mono">-1 unit</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-50 italic">
                                    AutoVault records checkout logs and manual audits automatically.
                                  </div>
                                </div>

                                {/* Column 3: Reorder Intelligence & Margins */}
                                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                      <TrendingUp size={14} className="text-slate-500" />
                                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inventory Intelligence</h4>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                      <div className="flex justify-between py-1 border-b border-slate-50">
                                        <span className="text-slate-550">Stock Status:</span>
                                        <span className={`font-bold ${outOfStock ? 'text-red-650 bg-red-50 px-1.5 py-0.5 rounded' : lowStock ? 'text-orange-650 bg-orange-50 px-1.5 py-0.5 rounded' : 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded'}`}>
                                          {outOfStock ? 'Out of Stock' : lowStock ? 'Low Stock Warning' : 'Healthy Stock'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between py-1 border-b border-slate-50">
                                        <span className="text-slate-550">Suggested Order:</span>
                                        <span className="font-bold text-slate-800 bg-slate-50 px-1.5 py-0.5 rounded">
                                          {outOfStock ? `${product.lowStockThreshold * 3} units` : lowStock ? `${product.lowStockThreshold * 2} units` : '0 units (Adequate)'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between py-1 border-b border-slate-50">
                                        <span className="text-slate-550">Replenishment Lead:</span>
                                        <span className="font-semibold text-slate-650">3 - 5 Days Est.</span>
                                      </div>
                                      {isOwner && (
                                        <div className="flex justify-between py-1">
                                          <span className="text-slate-555">Unit Profit:</span>
                                          <span className="font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                                            ₹{(product.sellPrice - product.buyPrice).toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-4 pt-2 border-t border-slate-50 italic">
                                    Based on low-stock thresholds & current transaction trends.
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-2 px-1">
          Showing {filtered.length} of {state.products.length} products
        </p>

        {/* ── ADD / EDIT PRODUCT MODAL ─────────────────────────────────────── */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <h2 className="font-bold text-slate-800">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="p-5 space-y-4">
                {formError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}
                {formWarning && !formError && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                    <span>{formWarning}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FieldLabel>Product Name *</FieldLabel>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="e.g. LED Headlight H7"
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <FieldLabel>SKU *{editingProduct && <span className="ml-1 text-slate-400 normal-case font-normal">(read-only)</span>}</FieldLabel>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => !editingProduct && setField("sku", e.target.value.toUpperCase())}
                      readOnly={!!editingProduct}
                      maxLength={40}
                      placeholder="e.g. LED-001 (3–40 chars, alphanumeric, - or _)"
                      className={`${INPUT} ${editingProduct ? "bg-slate-100 text-slate-500 cursor-not-allowed select-all" : "font-mono"}`}
                    />
                  </div>

                  <div>
                    <FieldLabel>Brand</FieldLabel>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setField("brand", e.target.value)}
                      placeholder="e.g. Philips"
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                      placeholder="e.g. Lights"
                      className={INPUT}
                    />
                  </div>

                  <div className="col-span-2">
                    <FieldLabel>Status</FieldLabel>
                    <select
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value as ProductStatus)}
                      className={INPUT}
                    >
                      {PRODUCT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel>Initial Stock</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => setField("stock", Number(e.target.value))}
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <FieldLabel>Buy Price (₹) — Owner Only</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={form.buyPrice}
                      onChange={(e) =>
                        setField("buyPrice", Number(e.target.value))
                      }
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <FieldLabel>Sell Price (₹) *</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      value={form.sellPrice}
                      onChange={(e) =>
                        setField("sellPrice", Number(e.target.value))
                      }
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <FieldLabel>Low Stock Alert (units)</FieldLabel>
                    <input
                      type="number"
                      min="1"
                      value={form.lowStockThreshold}
                      onChange={(e) =>
                        setField("lowStockThreshold", Number(e.target.value))
                      }
                      className={INPUT}
                    />
                  </div>
                </div>

                {/* Margin preview */}
                {form.buyPrice > 0 && form.sellPrice > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm">
                    <span className="text-green-700 font-medium">
                      Margin:{" "}
                      {Math.round(
                        ((form.sellPrice - form.buyPrice) / form.sellPrice) * 100
                      )}
                      % &nbsp;|&nbsp; Profit per unit: ₹
                      {(form.sellPrice - form.buyPrice).toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Compatible Vehicles (Fitments) Section */}
                <div className="border-t border-slate-150 pt-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Vehicle Compatibility (Fitment)
                  </h3>

                  {/* List of current fitments */}
                  {form.fitments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">
                      No compatible vehicles added. This product fits all vehicle makes & models.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      {form.fitments.map((fit, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold"
                        >
                          {fit.brand} {fit.model} ({fit.year})
                          <button
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                fitments: prev.fitments.filter((_, i) => i !== idx),
                              }));
                            }}
                            className="text-slate-400 hover:text-red-650 focus:outline-none transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Inline form to add a vehicle */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                    <p className="text-xs font-bold text-slate-600">
                      Add Compatible Vehicle Model
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <input
                          type="text"
                          placeholder="Brand (Honda)"
                          value={newFitBrand}
                          onChange={(e) => setNewFitBrand(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-600/25 focus:border-navy-600 transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Model (City)"
                          value={newFitModel}
                          onChange={(e) => setNewFitModel(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-600/25 focus:border-navy-600 transition-all"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Year (2021)"
                          value={newFitYear}
                          onChange={(e) => setNewFitYear(e.target.value)}
                          className="w-full border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-navy-600/25 focus:border-navy-600 transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const brand = newFitBrand.trim();
                        const model = newFitModel.trim();
                        const year = newFitYear.trim();

                        if (!brand || !model || !year) {
                          alert("Please fill in Brand, Model, and Year to add fitment.");
                          return;
                        }

                        // Check if already exists
                        const exists = form.fitments.some(
                          (f) =>
                            f.brand.toLowerCase() === brand.toLowerCase() &&
                            f.model.toLowerCase() === model.toLowerCase() &&
                            f.year === year
                        );

                        if (exists) {
                          alert("This vehicle fitment is already added.");
                          return;
                        }

                        setForm((prev) => ({
                          ...prev,
                          fitments: [...prev.fitments, { brand, model, year }],
                        }));

                        // Reset inputs
                        setNewFitBrand("");
                        setNewFitModel("");
                        setNewFitYear("");
                      }}
                      className="w-full bg-navy-950 hover:bg-navy-800 text-white text-xs py-2 rounded-lg font-semibold transition-colors cursor-pointer"
                    >
                      + Add Compatible Vehicle
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-navy-950 hover:bg-navy-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ADJUST STOCK MODAL ────────────────────────────────────────────── */}
        {stockModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-200">
                <div>
                  <h2 className="font-bold text-slate-800">Adjust Stock</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {stockModal.name}
                  </p>
                </div>
                <button
                  onClick={() => setStockModal(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Current stock */}
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-500 mb-1">Current Stock</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stockModal.stock}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">units</p>
                </div>

                {/* Amount */}
                <div>
                  <FieldLabel>Quantity to Add or Remove</FieldLabel>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter units..."
                    value={stockDelta}
                    onChange={(e) => setStockDelta(e.target.value)}
                    className={INPUT}
                    autoFocus
                  />
                </div>

                {/* Preview */}
                {Number(stockDelta) > 0 && (
                  <div className="grid grid-cols-2 gap-3 text-center text-sm">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-xs text-green-600 mb-1">After Adding</p>
                      <p className="font-bold text-green-700">
                        {stockModal.stock + Number(stockDelta)}
                      </p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-xs text-red-600 mb-1">After Removing</p>
                      <p className="font-bold text-red-700">
                        {Math.max(0, stockModal.stock - Number(stockDelta))}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-5 pb-5">
                <button
                  onClick={() => handleStockAdjust("remove")}
                  disabled={!stockDelta || Number(stockDelta) <= 0}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  − Remove
                </button>
                <button
                  onClick={() => handleStockAdjust("add")}
                  disabled={!stockDelta || Number(stockDelta) <= 0}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  const INPUT =
    "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-600/20 focus:border-navy-600 transition-all placeholder:text-slate-400";

  function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
        {children}
      </label>
    );
  }

  function StatCard({
    label,
    value,
    icon,
    iconBg,
    valueClass = "text-slate-800",
  }: {
    label: string;
    value: number;
    icon: React.ReactNode;
    iconBg: string;
    valueClass?: string;
  }) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start justify-between hover:shadow-sm transition-shadow">
        <div>
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    );
  }