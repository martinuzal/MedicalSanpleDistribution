export interface MaterialCoverage {
  materialId: string;
  cantXCriterioSegmentado: number | null;
  cantidadCrierioDirecto: number | null;  // Note: Spelling matches SP column name
  cantTotal: number | null;
  cantAjustada: number | null;
  cantDifPackJefe: number | null;
  cantEnviar: number | null;
  porcCobert: number | null;
  stock: number | null;
  pack: number | null;
  minStock: number | null;
  maxStock: number | null;
  porcCobertStockMin: number | null;
  cantEnviarDelegaciones: number | null;
  cantAjustadaCriterio: number | null;
  cantAjustadaDirecta: number | null;
  cantAjustadaTotal: number | null;
  cantTotalEnviar: number | null;
  cantTotalAPM: number | null;
  semaforo: 'VERDE' | 'AMARILLO' | 'ROJO' | null;
}

export interface CoverageSummary {
  totalMaterials: number;
  totalStock: number;
  totalCantEnviar: number;
  averageCoverage: number;
  materialsWithNegativeStock: number;
  materialsWithinRange: number;
}

export interface CoverageDashboard {
  importId: number;
  materials: MaterialCoverage[];
  summary: CoverageSummary;
}
