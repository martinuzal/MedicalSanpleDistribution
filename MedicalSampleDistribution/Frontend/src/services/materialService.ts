import axios from 'axios';
import type { Material, MaterialDetail, MaterialListResponse } from '../types/material';

const API_BASE_URL = 'http://localhost:5001/api';

export const materialService = {
  async getAll(params?: {
    search?: string;
    status?: string;
    importId?: number;
    pageNumber?: number;
    pageSize?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.importId) queryParams.append('importId', params.importId.toString());
    if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const response = await axios.get<MaterialListResponse>(`${API_BASE_URL}/materials?${queryParams}`);
    return response.data;
  },

  async getById(id: number) {
    const response = await axios.get<MaterialDetail>(`${API_BASE_URL}/materials/${id}`);
    return response.data;
  },

  async getByCodigoSap(codigoSap: string) {
    const response = await axios.get<MaterialDetail>(`${API_BASE_URL}/materials/by-codigo/${codigoSap}`);
    return response.data;
  }
};
