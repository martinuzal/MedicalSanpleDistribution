import type { Import } from './import';

export interface ConfigurationCriteria {
  id: number;
  tipoCliente: string | null;
  campania: string | null;
  lugarVisita: string | null;
  institucion: string | null;
  especialidad: string | null;
  edad: string | null;
  sexo: string | null;
  especialidadSec: string | null;
  especialidadCartera: string | null;
  categoria: string | null;
  tarea: string | null;
  frecuencia: number | null;
  planificacion: string | null;
  provincia: string | null;
  tratamiento: string | null;
  objetosEntregados: string | null;
  linea: string | null;
  auditCategoria: string | null;
  auditMercado: string | null;
  auditProducto: string | null;
  auditMolecula: string | null;
  porcenDeAplic: number | null;
  countPreview: number | null;
  rowId: number | null;
}

export interface DirectAssignment {
  id: number;
  supervisor: string | null;
  legajoSupervisor: string | null;
  representante: string | null;
  legajoRepresentante: string | null;
  excluded: string | null;
  rowId: number | null;
}

export interface MaterialConfiguration {
  id: number;
  codigoSap: string;
  description: string;
  pack: number;
  maxStock: number | null;
  minStock: number | null;
  maestro: number;
  useStockReal: boolean | null;
  stockManual: number | null;
  currentStock: number | null;
}

export interface ImportStatistics {
  totalCriteria: number;
  totalDirectAssignments: number;
  totalMaterials: number;
  totalStock: number;
  materialsWithMinMax: number;
}

export interface ImportDetail {
  import: Import;
  criteria: ConfigurationCriteria[];
  directAssignments: DirectAssignment[];
  materials: MaterialConfiguration[];
  statistics: ImportStatistics;
}
