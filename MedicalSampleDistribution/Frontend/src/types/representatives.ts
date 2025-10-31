export interface RepresentativeDetail {
  code: number;
  firstName: string | null;
  lastName: string | null;
  description: string | null;
  districtCode: number | null;
  districtDescription: string | null;
  regionCode: number | null;
  regionDescription: string | null;
  managerCode: number | null;
  managerDescription: string | null;
  status: string | null;
  regionManagerCode: number | null;
  businessLineCode: number | null;
  businessLineDescription: string | null;
  legacyCode: string | null;
}

export interface RepresentativesList {
  representatives: RepresentativeDetail[];
  totalCount: number;
}

export interface RegionFilter {
  code: number;
  description: string;
}

export interface DistrictFilter {
  code: number;
  description: string;
}

export interface ManagerFilter {
  code: number;
  description: string;
}

export interface BusinessLineFilter {
  code: number;
  description: string;
}

export interface RepresentativesFilters {
  regions: RegionFilter[];
  districts: DistrictFilter[];
  managers: ManagerFilter[];
  businessLines: BusinessLineFilter[];
}
