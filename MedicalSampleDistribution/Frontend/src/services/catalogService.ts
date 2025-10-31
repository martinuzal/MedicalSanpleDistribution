import axios from 'axios';
import type { CatalogItem, Representative, MaterialStock, AllCatalogs } from '../types/catalog';

const API_BASE_URL = 'http://localhost:5001/api';

export const catalogService = {
  async getCategories() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/categories`);
    return response.data;
  },

  async getCustomerTypes() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/customer-types`);
    return response.data;
  },

  async getSpecialties() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/specialties`);
    return response.data;
  },

  async getInstitutionTypes() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/institution-types`);
    return response.data;
  },

  async getStates() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/states`);
    return response.data;
  },

  async getLines() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/lines`);
    return response.data;
  },

  async getRepresentatives() {
    const response = await axios.get<Representative[]>(`${API_BASE_URL}/catalogs/representatives`);
    return response.data;
  },

  async getSupervisors() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/supervisors`);
    return response.data;
  },

  async getAuditMarkets() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/audit-markets`);
    return response.data;
  },

  async getAuditMolecules() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/audit-molecules`);
    return response.data;
  },

  async getAuditProducts() {
    const response = await axios.get<CatalogItem[]>(`${API_BASE_URL}/catalogs/audit-products`);
    return response.data;
  },

  async getMaterialsStock(importId?: number) {
    const url = importId
      ? `${API_BASE_URL}/catalogs/materials-stock?importId=${importId}`
      : `${API_BASE_URL}/catalogs/materials-stock`;
    const response = await axios.get<MaterialStock[]>(url);
    return response.data;
  },

  // Obtener todos los catálogos de una vez (útil para inicialización)
  async getAllCatalogs() {
    const response = await axios.get<AllCatalogs>(`${API_BASE_URL}/catalogs/all`);
    return response.data;
  },
};
