import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { CoverageDashboard, MaterialCoverage } from '../../types/coverageDashboard';
import { coverageDashboardService } from '../../services/coverageDashboardService';
import { useNotifications } from '../../contexts/NotificationContext';
import './CoverageDashboard.css';

export default function CoverageDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<CoverageDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof MaterialCoverage>('materialId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [colorFilter, setColorFilter] = useState<'VERDE' | 'AMARILLO' | 'ROJO' | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (id) {
      loadDashboard(parseInt(id));
    }
  }, [id]);

  const loadDashboard = async (importId: number) => {
    try {
      setLoading(true);
      const data = await coverageDashboardService.getCoverageDashboard(importId);
      setDashboard(data);
    } catch (error) {
      addNotification('Error al cargar dashboard de cobertura', 'error');
      console.error('Error loading coverage dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof MaterialCoverage) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedMaterials = () => {
    if (!dashboard) return [];

    // First filter by color if a filter is active
    let filtered = [...dashboard.materials];
    if (colorFilter) {
      filtered = filtered.filter(m => m.semaforo === colorFilter);
    }

    // Then sort
    const sorted = filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return sorted;
  };

  const formatNumber = (value: number | null) => {
    if (value === null) return '-';
    return value.toLocaleString('es-ES');
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return '-';
    return `${(value * 100).toFixed(2)}%`;
  };

  const getColorCounts = () => {
    if (!dashboard) return { verde: 0, amarillo: 0, rojo: 0 };

    const counts = {
      verde: 0,
      amarillo: 0,
      rojo: 0
    };

    dashboard.materials.forEach(material => {
      if (material.semaforo === 'VERDE') counts.verde++;
      else if (material.semaforo === 'AMARILLO') counts.amarillo++;
      else if (material.semaforo === 'ROJO') counts.rojo++;
    });

    return counts;
  };

  const getSemaforoIcon = (color: 'VERDE' | 'AMARILLO' | 'ROJO' | null) => {
    switch(color) {
      case 'VERDE':
        return '🟢';
      case 'AMARILLO':
        return '🟡';
      case 'ROJO':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const handleMaterialClick = (materialId: string) => {
    // Extract material code from format like "[0114M] ALIDASE 500 X 2 COMP. (M)"
    const match = materialId.match(/\[([^\]]+)\]/);
    const materialCode = match ? match[1] : materialId;
    navigate(`/marcaciones/${id}/material/${encodeURIComponent(materialCode)}`);
  };

  const getStockStatus = (material: MaterialCoverage): 'negative' | 'low' | 'ok' | 'good' => {
    const cantEnviar = material.cantEnviar ?? 0;

    if (cantEnviar < 0) return 'negative';
    if (material.minStock && cantEnviar < material.minStock) return 'low';
    if (material.minStock && material.maxStock && cantEnviar >= material.minStock && cantEnviar <= material.maxStock) return 'good';
    return 'ok';
  };

  if (loading) {
    return (
      <div className="coverage-dashboard">
        <div className="loading">Cargando dashboard...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="coverage-dashboard">
        <div className="error">No se pudo cargar el dashboard</div>
      </div>
    );
  }

  return (
    <div className="coverage-dashboard">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/marcaciones')}>
            <span className="material-icons">arrow_back</span>
            Volver
          </button>
          <h1>Dashboard de Cobertura por Material</h1>
          <p className="page-description">Marcación ID: {dashboard.importId}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">inventory_2</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Materiales</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalMaterials)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">store</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Stock Total</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalStock)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">local_shipping</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total a Enviar</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalCantEnviar)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">insights</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Cobertura Promedio</div>
            <div className="summary-value">{formatPercent(dashboard.summary.averageCoverage)}</div>
          </div>
        </div>

        <div
          className={`summary-card semaforo-green ${colorFilter === 'VERDE' ? 'active' : ''}`}
          onClick={() => setColorFilter(colorFilter === 'VERDE' ? null : 'VERDE')}
          style={{ cursor: 'pointer' }}
        >
          <div className="summary-icon">
            <span style={{ fontSize: '2rem' }}>🟢</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Semáforo Verde</div>
            <div className="summary-value">{formatNumber(getColorCounts().verde)}</div>
          </div>
        </div>

        <div
          className={`summary-card semaforo-yellow ${colorFilter === 'AMARILLO' ? 'active' : ''}`}
          onClick={() => setColorFilter(colorFilter === 'AMARILLO' ? null : 'AMARILLO')}
          style={{ cursor: 'pointer' }}
        >
          <div className="summary-icon">
            <span style={{ fontSize: '2rem' }}>🟡</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Semáforo Amarillo</div>
            <div className="summary-value">{formatNumber(getColorCounts().amarillo)}</div>
          </div>
        </div>

        <div
          className={`summary-card semaforo-red ${colorFilter === 'ROJO' ? 'active' : ''}`}
          onClick={() => setColorFilter(colorFilter === 'ROJO' ? null : 'ROJO')}
          style={{ cursor: 'pointer' }}
        >
          <div className="summary-icon">
            <span style={{ fontSize: '2rem' }}>🔴</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Semáforo Rojo</div>
            <div className="summary-value">{formatNumber(getColorCounts().rojo)}</div>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="table-container">
        <table className="coverage-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('materialId')}>
                Material {sortField === 'materialId' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('cantXCriterioSegmentado')}>
                Cant. Criterio {sortField === 'cantXCriterioSegmentado' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('cantidadCrierioDirecto')}>
                Cant. Directo {sortField === 'cantidadCrierioDirecto' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('cantTotal')}>
                Total {sortField === 'cantTotal' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('cantEnviar')}>
                Cant. Enviar {sortField === 'cantEnviar' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('porcCobert')}>
                % Cobertura {sortField === 'porcCobert' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('stock')}>
                Stock {sortField === 'stock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('pack')}>
                Pack {sortField === 'pack' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('minStock')}>
                Min Stock {sortField === 'minStock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('maxStock')}>
                Max Stock {sortField === 'maxStock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Estado</th>
              <th>Semáforo</th>
            </tr>
          </thead>
          <tbody>
            {getSortedMaterials().map((material, index) => (
              <tr key={index} className={`status-${getStockStatus(material)}`}>
                <td
                  className="material-name clickable"
                  onClick={() => handleMaterialClick(material.materialId)}
                  title="Click para ver detalle"
                >
                  {material.materialId}
                </td>
                <td className="number">{formatNumber(material.cantXCriterioSegmentado)}</td>
                <td className="number">{formatNumber(material.cantidadCrierioDirecto)}</td>
                <td className="number">{formatNumber(material.cantTotal)}</td>
                <td className="number emphasized">{formatNumber(material.cantEnviar)}</td>
                <td className="number">{formatPercent(material.porcCobert)}</td>
                <td className="number">{formatNumber(material.stock)}</td>
                <td className="number">{formatNumber(material.pack)}</td>
                <td className="number">{formatNumber(material.minStock)}</td>
                <td className="number">{formatNumber(material.maxStock)}</td>
                <td className="status-cell">
                  <span className={`status-badge status-${getStockStatus(material)}`}>
                    {getStockStatus(material) === 'negative' && 'Negativo'}
                    {getStockStatus(material) === 'low' && 'Bajo'}
                    {getStockStatus(material) === 'ok' && 'OK'}
                    {getStockStatus(material) === 'good' && 'Óptimo'}
                  </span>
                </td>
                <td className="semaforo-cell">
                  <span className="semaforo-icon" title={material.semaforo || 'Sin valor'}>
                    {getSemaforoIcon(material.semaforo)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
