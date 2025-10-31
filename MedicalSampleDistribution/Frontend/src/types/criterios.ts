export interface Criterio {
  criterio: string | null;
  material: string | null;
  materialId: string | null;
}

export interface CriteriosList {
  importId: number;
  criterios: Criterio[];
}
