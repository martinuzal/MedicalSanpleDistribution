export interface CatalogItem {
  code: string;
  displayMember: string;
}

export interface Representative {
  code: number;
  displayMember: string;
}

export interface MaterialStock {
  codigoSap: string;
  description: string;
  stock?: number;
  pack?: number;
}

export interface AllCatalogs {
  categories: CatalogItem[];
  customerTypes: CatalogItem[];
  specialties: CatalogItem[];
  institutionTypes: CatalogItem[];
  states: CatalogItem[];
  lines: CatalogItem[];
  representatives: Representative[];
  supervisors: CatalogItem[];
  auditMarkets: CatalogItem[];
  auditMolecules: CatalogItem[];
  auditProducts: CatalogItem[];
}
