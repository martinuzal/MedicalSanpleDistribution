import axios from 'axios';
import type { Import, CreateImportDto, UpdateImportDto, ImportListResponse } from '../types/import';
import type { ImportDetail } from '../types/importDetail';

const API_BASE_URL = 'http://localhost:5001/api';

export const importService = {
  async getAll(params?: {
    state?: string;
    fromDate?: string;
    toDate?: string;
    hasDistribution?: boolean;
    pageNumber?: number;
    pageSize?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.state) queryParams.append('state', params.state);
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);
    if (params?.hasDistribution !== undefined) queryParams.append('hasDistribution', params.hasDistribution.toString());
    if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

    const response = await axios.get<ImportListResponse>(`${API_BASE_URL}/imports?${queryParams}`);
    return response.data;
  },

  async getById(id: number) {
    const response = await axios.get<Import>(`${API_BASE_URL}/imports/${id}`);
    return response.data;
  },

  async getDetail(id: number): Promise<ImportDetail> {
    const response = await axios.get<ImportDetail>(`${API_BASE_URL}/imports/${id}/detail`);
    return response.data;
  },

  async create(data: CreateImportDto) {
    const response = await axios.post<Import>(`${API_BASE_URL}/imports`, data);
    return response.data;
  },

  async update(id: number, data: UpdateImportDto) {
    const response = await axios.put<Import>(`${API_BASE_URL}/imports/${id}`, data);
    return response.data;
  },

  async delete(id: number, usuario: string) {
    await axios.delete(`${API_BASE_URL}/imports/${id}?usuario=${encodeURIComponent(usuario)}`);
  }
};
