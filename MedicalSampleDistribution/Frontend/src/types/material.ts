export interface Material {
  id: number;
  codigoSap: string;
  description: string;
  status: string;
  currentStock?: number;
  pack?: number;
}

export interface MaterialStockInfo {
  importId: number;
  stock?: number;
  stockReal?: number;
  pack: number;
  maxStock?: number;
  minStock?: number;
  useStockReal?: boolean;
  stockManual?: number;
}

export interface MaterialDetail {
  id: number;
  codigoSap: string;
  description: string;
  status: string;
  stockByImport?: MaterialStockInfo[];
}

export interface MaterialListResponse {
  materials: Material[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
