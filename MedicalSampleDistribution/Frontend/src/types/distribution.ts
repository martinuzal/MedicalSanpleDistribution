export interface Distribution {
  id: number;
  representativeCode: number;
  representativeName: string;
  supervisorCode: number;
  supervisorName: string;
  materialId: string;
  materialDescription: string;
  importId: number;
  importDate: string | null;
  importState: string | null;
  legajoSap: string | null;
  cant: number;
}

export interface DistributionListResponse {
  distributions: Distribution[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface DistributionSummary {
  representativeCode: number;
  representativeName: string;
  totalQuantity: number;
  materialsCount: number;
}

export interface RepresentativeDistribution {
  representativeCode: number;
  representativeName: string;
  materials: MaterialDistribution[];
  totalQuantity: number;
}

export interface MaterialDistribution {
  materialId: string;
  materialDescription: string;
  quantity: number;
}
