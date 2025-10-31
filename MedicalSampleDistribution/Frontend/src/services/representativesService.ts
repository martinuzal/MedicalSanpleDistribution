import type { RepresentativesList, RepresentativesFilters } from '../types/representatives';

const API_URL = 'http://localhost:5001/api';

export const representativesService = {
  async getRepresentatives(params?: {
    regionCode?: number;
    districtCode?: number;
    managerCode?: number;
    businessLineCode?: number;
    search?: string;
  }): Promise<RepresentativesList> {
    const queryParams = new URLSearchParams();

    if (params?.regionCode) queryParams.append('regionCode', params.regionCode.toString());
    if (params?.districtCode) queryParams.append('districtCode', params.districtCode.toString());
    if (params?.managerCode) queryParams.append('managerCode', params.managerCode.toString());
    if (params?.businessLineCode) queryParams.append('businessLineCode', params.businessLineCode.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = `${API_URL}/representatives${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async getFilters(): Promise<RepresentativesFilters> {
    const response = await fetch(`${API_URL}/representatives/filters`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};
