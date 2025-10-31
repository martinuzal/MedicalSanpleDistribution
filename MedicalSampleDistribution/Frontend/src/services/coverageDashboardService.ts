import axios from 'axios';
import type { CoverageDashboard } from '../types/coverageDashboard';

const API_BASE_URL = 'http://localhost:5001/api';

class CoverageDashboardService {
  async getCoverageDashboard(importId: number): Promise<CoverageDashboard> {
    const response = await axios.get<CoverageDashboard>(
      `${API_BASE_URL}/imports/${importId}/coverage-dashboard`
    );
    return response.data;
  }
}

export const coverageDashboardService = new CoverageDashboardService();
