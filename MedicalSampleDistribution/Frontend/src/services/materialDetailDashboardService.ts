import type { MaterialDetailDashboard } from '../types/materialDetailDashboard';

const API_URL = 'http://localhost:5001/api';

export const materialDetailDashboardService = {
  async getMaterialDetailDashboard(importId: number, materialId: string): Promise<MaterialDetailDashboard> {
    const response = await fetch(
      `${API_URL}/imports/${importId}/material-detail/${encodeURIComponent(materialId)}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al cargar dashboard de detalle de material');
    }

    return response.json();
  },

  async getGeneralDistributionDashboard(importId: number): Promise<MaterialDetailDashboard> {
    const response = await fetch(
      `${API_URL}/imports/${importId}/general-distribution-dashboard`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al cargar dashboard de distribución general');
    }

    return response.json();
  }
};