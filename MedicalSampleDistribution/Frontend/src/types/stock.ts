export interface Stock {
  id: number;
  codigoSap: string;
  materialDescription: string;
  stock: number | null;
  stockReal: number | null;
  stockManual: number | null;
  pack: number | null;
  importId: number | null;
  importDate: string | null;
  importState: string | null;
}

export interface StockDetail {
  id: number;
  codigoSap: string;
  materialDescription: string;
  stock: number | null;
  stockReal: number | null;
  stockManual: number | null;
  pack: number | null;
  importId: number | null;
  codigoSapLegacy: string | null;
  importDate: string | null;
  importState: string | null;
  userName: string | null;
}

export interface UpdateStockManualDto {
  stockManual: number | null;
}

export interface StockListResponse {
  stocks: Stock[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface StockSummary {
  codigoSap: string;
  materialDescription: string;
  totalStock: number;
  totalStockReal: number;
  importCount: number;
}
