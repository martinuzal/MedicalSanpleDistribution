import type { CriteriosList } from '../types/criterios';

const API_URL = 'http://localhost:5001/api';

export const criteriosService = {
  async getCriterios(importId: number): Promise<CriteriosList> {
    const response = await fetch(
      `${API_URL}/imports/${importId}/criterios`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al cargar criterios');
    }

    return response.json();
  }
};
