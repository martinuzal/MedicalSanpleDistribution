import axios from 'axios';
import type { DistributionListResponse, DistributionSummary, RepresentativeDistribution } from '../types/distribution';

const API_BASE_URL = 'http://localhost:5001/api';

export const distributionService = {
  async getAll(params?: {
    importId?: number;
    representativeCode?: number;
    supervisorCode?: number;
    materialId?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<DistributionListResponse> {
    const response = await axios.get(`${API_BASE_URL}/distribution`, { params });
    return response.data;
  },

  async getSummary(importId?: number): Promise<DistributionSummary[]> {
    const response = await axios.get(`${API_BASE_URL}/distribution/summary`, {
      params: { importId }
    });
    return response.data;
  },

  async getByRepresentative(representativeCode: number, importId?: number): Promise<RepresentativeDistribution> {
    const response = await axios.get(`${API_BASE_URL}/distribution/by-representative/${representativeCode}`, {
      params: { importId }
    });
    return response.data;
  }
};
