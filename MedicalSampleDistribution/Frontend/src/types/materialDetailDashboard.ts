export interface MaterialDetailByRepSup {
  supervisor: string | null;
  representativeCode: string | null;
  materialId: string | null;
  cantEnviar: number | null;
  isJefe: number | null;
}

export interface MaterialDetailSummary {
  totalRecords: number;
  totalRepresentantes: number;
  totalSupervisores: number;
  totalCantEnviar: number;
  totalJefes: number;
  cantEnviarJefes: number;
  cantEnviarRepresentantes: number;
}

export interface MaterialDetailDashboard {
  importId: number;
  materialId: string;
  materialName: string;
  details: MaterialDetailByRepSup[];
  summary: MaterialDetailSummary;
}