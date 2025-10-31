import axios from 'axios';
import type { StockListResponse, StockDetail, UpdateStockManualDto, StockSummary, Stock } from '../types/stock';

const API_BASE_URL = 'http://localhost:5001/api';

export const stockService = {
  async getAll(params?: {
    search?: string;
    importId?: number;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<StockListResponse> {
    const response = await axios.get(`${API_BASE_URL}/stock`, { params });
    return response.data;
  },

  async getById(id: number): Promise<StockDetail> {
    const response = await axios.get(`${API_BASE_URL}/stock/${id}`);
    return response.data;
  },

  async getSummary(importId?: number): Promise<StockSummary[]> {
    const response = await axios.get(`${API_BASE_URL}/stock/summary`, {
      params: { importId }
    });
    return response.data;
  },

  async updateStockManual(id: number, data: UpdateStockManualDto): Promise<void> {
    await axios.put(`${API_BASE_URL}/stock/${id}/stock-manual`, data);
  },

  async getByMaterial(codigoSap: string): Promise<Stock[]> {
    const response = await axios.get(`${API_BASE_URL}/stock/by-material/${codigoSap}`);
    return response.data;
  }
};
