import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import type { MaterialDetailDashboard, MaterialDetailByRepSup } from '../../types/materialDetailDashboard';
import { materialDetailDashboardService } from '../../services/materialDetailDashboardService';
import { useNotifications } from '../../contexts/NotificationContext';
import './MaterialDetailDashboard.css';

export default function MaterialDetailDashboardPage() {
  const { id, materialId } = useParams<{ id: string; materialId: string }>();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<MaterialDetailDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof MaterialDetailByRepSup>('supervisor');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterSupervisor, setFilterSupervisor] = useState<string | null>(null);
  const [showOnlyJefes, setShowOnlyJefes] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (id && materialId) {
      loadDashboard(parseInt(id), materialId);
    }
  }, [id, materialId]);

  const loadDashboard = async (importId: number, matId: string) => {
    try {
      setLoading(true);
      const data = await materialDetailDashboardService.getMaterialDetailDashboard(importId, matId);
      console.log('Dashboard data:', data);
      console.log('Material name:', data.materialName);
      setDashboard(data);
    } catch (error) {
      addNotification('Error al cargar dashboard de detalle de material', 'error');
      console.error('Error loading material detail dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof MaterialDetailByRepSup) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredDetails = () => {
    if (!dashboard) return [];

    let filtered = [...dashboard.details];

    // Filter by supervisor if selected
    if (filterSupervisor) {
      filtered = filtered.filter(d => d.supervisor === filterSupervisor);
    }

    // Filter by jefes if enabled
    if (showOnlyJefes) {
      filtered = filtered.filter(d => d.isJefe === 1);
    }

    // Sort
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

  // Prepare data for Top 10 Representatives Bar Chart
  const top10Data = useMemo(() => {
    if (!dashboard) return [];

    // Sort by cantEnviar and take top 10
    const sortedByQuantity = [...dashboard.details]
      .filter(d => d.cantEnviar && d.cantEnviar > 0)
      .sort((a, b) => (b.cantEnviar || 0) - (a.cantEnviar || 0))
      .slice(0, 10);

    return sortedByQuantity.map(d => ({
      representative: d.representativeCode?.substring(0, 20) || 'Unknown',
      cantidad: d.cantEnviar || 0,
      isJefe: d.isJefe === 1
    }));
  }, [dashboard]);

  // Prepare data for Pareto Chart (Cumulative Distribution)
  const paretoData = useMemo(() => {
    if (!dashboard) return { lines: [], totalReps: 0 };

    // Sort all representatives by quantity descending
    const sortedByQuantity = [...dashboard.details]
      .filter(d => d.cantEnviar && d.cantEnviar > 0)
      .sort((a, b) => (b.cantEnviar || 0) - (a.cantEnviar || 0));

    const total = sortedByQuantity.reduce((sum, d) => sum + (d.cantEnviar || 0), 0);
    let cumulative = 0;

    // Create data points for every 5th representative (to avoid too many points)
    const dataPoints = [];
    sortedByQuantity.forEach((d, index) => {
      cumulative += (d.cantEnviar || 0);
      if (index % Math.ceil(sortedByQuantity.length / 20) === 0 || index === sortedByQuantity.length - 1) {
        dataPoints.push({
          x: index + 1,
          y: Math.round((cumulative / total) * 100)
        });
      }
    });

    // Add starting point
    if (dataPoints.length > 0 && dataPoints[0].x !== 1) {
      dataPoints.unshift({ x: 0, y: 0 });
    }

    return {
      lines: [{
        id: 'acumulado',
        color: 'hsl(220, 70%, 50%)',
        data: dataPoints
      }],
      totalReps: sortedByQuantity.length
    };
  }, [dashboard]);

  const formatNumber = (value: number | null) => {
    if (value === null) return '-';
    return value.toLocaleString('es-ES');
  };

  const getUniqueSupervisors = () => {
    if (!dashboard) return [];
    return [...new Set(dashboard.details.map(d => d.supervisor).filter(s => s !== null))];
  };

  const getRowClass = (detail: MaterialDetailByRepSup) => {
    if (detail.isJefe === 1) return 'jefe-row';
    return '';
  };

  if (loading) {
    return (
      <div className="material-detail-dashboard">
        <div className="loading">Cargando dashboard de detalle...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="material-detail-dashboard">
        <div className="error">No se pudo cargar el dashboard</div>
      </div>
    );
  }

  return (
    <div className="material-detail-dashboard">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate(`/marcaciones/${id}/dashboard`)}>
            <span className="material-icons">arrow_back</span>
            Volver al Dashboard de Cobertura
          </button>
          <h1>Detalle por Representante y Supervisor</h1>
          <p className="page-description">
            Marcación ID: {dashboard.importId}
          </p>
          <h2 className="material-title">{dashboard.materialName}</h2>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">group</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Registros</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalRecords)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">person</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Representantes</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalRepresentantes)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">supervisor_account</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Supervisores</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalSupervisores)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">inventory</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total a Enviar</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalCantEnviar)}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="material-icons">business</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Delegaciones (Jefes)</div>
            <div className="summary-value">{formatNumber(dashboard.summary.totalJefes)}</div>
          </div>
        </div>

        <div className="summary-card highlight">
          <div className="summary-icon">
            <span className="material-icons">local_shipping</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Envío a Delegaciones</div>
            <div className="summary-value">{formatNumber(dashboard.summary.cantEnviarJefes)}</div>
          </div>
        </div>

        <div className="summary-card highlight">
          <div className="summary-icon">
            <span className="material-icons">people</span>
          </div>
          <div className="summary-content">
            <div className="summary-label">Envío a Representantes</div>
            <div className="summary-value">{formatNumber(dashboard.summary.cantEnviarRepresentantes)}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h2>Top 10 Representantes/Delegaciones por Cantidad</h2>
          <div className="chart-wrapper" style={{ height: '400px' }}>
            <ResponsiveBar
              data={top10Data}
              keys={['cantidad']}
              indexBy="representative"
              margin={{ top: 50, right: 60, bottom: 80, left: 80 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={(bar) => bar.data.isJefe ? '#9b59b6' : '#4a9eff'}
              borderRadius={6}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 0.3]]
              }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Cantidad a Enviar',
                legendPosition: 'middle',
                legendOffset: -60
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{
                from: 'color',
                modifiers: [['darker', 3]]
              }}
              label={(d) => `${d.value}`}
              theme={{
                labels: {
                  text: {
                    fontSize: 14,
                    fontWeight: 600
                  }
                }
              }}
              animate={true}
              motionConfig="wobbly"
              tooltip={({ data }) => (
                <div style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}>
                  <strong>{data.representative}</strong>
                  <br />
                  Cantidad: {formatNumber(data.cantidad as number)}
                  <br />
                  Tipo: {data.isJefe ? 'Delegación' : 'Representante'}
                </div>
              )}
            />
          </div>
          <p className="chart-legend">
            <span className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#4a9eff' }}></span>
              Representante
            </span>
            <span className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#9b59b6' }}></span>
              Delegación (Jefe)
            </span>
          </p>
        </div>

        <div className="chart-container">
          <h2>Distribución Acumulada (Pareto)</h2>
          <div className="chart-wrapper" style={{ height: '400px' }}>
            <ResponsiveLine
              data={paretoData.lines}
              margin={{ top: 50, right: 60, bottom: 80, left: 80 }}
              xScale={{ type: 'linear', min: 0, max: paretoData.totalReps }}
              yScale={{ type: 'linear', min: 0, max: 100 }}
              yFormat=">-.0f"
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `Cantidad de Representantes (Total: ${paretoData.totalReps})`,
                legendPosition: 'middle',
                legendOffset: 50
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '% Acumulado del Material',
                legendPosition: 'middle',
                legendOffset: -60,
                format: (value) => `${value}%`
              }}
              gridYValues={[0, 20, 40, 60, 80, 100]}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              enableArea={true}
              areaOpacity={0.15}
              useMesh={true}
              animate={true}
              motionConfig="gentle"
              tooltip={({ point }) => (
                <div style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}>
                  <strong>{Math.round(point.data.x as number)} representantes</strong>
                  <br />
                  distribuyen el <strong>{point.data.y}%</strong> del material
                </div>
              )}
              markers={[
                {
                  axis: 'y',
                  value: 80,
                  lineStyle: { stroke: '#ff6b6b', strokeWidth: 2, strokeDasharray: '6 6' },
                  legend: '80% del material',
                  legendOrientation: 'horizontal',
                  textStyle: { fill: '#ff6b6b', fontSize: 12 }
                }
              ]}
            />
          </div>
          <p className="chart-description">
            Este gráfico muestra cuántos representantes acumulan el total del material a distribuir.
            La línea roja marca el 80% del material (principio de Pareto).
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="supervisor-filter">Filtrar por Supervisor:</label>
          <select
            id="supervisor-filter"
            value={filterSupervisor || ''}
            onChange={(e) => setFilterSupervisor(e.target.value || null)}
            className="filter-select"
          >
            <option value="">Todos los supervisores</option>
            {getUniqueSupervisors().map(supervisor => (
              <option key={supervisor} value={supervisor || ''}>
                {supervisor}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOnlyJefes}
              onChange={(e) => setShowOnlyJefes(e.target.checked)}
            />
            <span>Mostrar solo Delegaciones (Jefes)</span>
          </label>
        </div>
      </div>

      {/* Details Table */}
      <div className="table-container">
        <table className="detail-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('supervisor')}>
                Supervisor {sortField === 'supervisor' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('representativeCode')}>
                Representante/Delegación {sortField === 'representativeCode' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('cantEnviar')}>
                Cantidad a Enviar {sortField === 'cantEnviar' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {getSortedAndFilteredDetails().map((detail, index) => (
              <tr key={index} className={getRowClass(detail)}>
                <td>{detail.supervisor}</td>
                <td className="representative-name">
                  {detail.representativeCode}
                  {detail.isJefe === 1 && (
                    <span className="jefe-badge">DELEGACIÓN</span>
                  )}
                </td>
                <td className="number emphasized">{formatNumber(detail.cantEnviar)}</td>
                <td className="type-cell">
                  {detail.isJefe === 1 ? (
                    <span className="type-badge jefe">Jefe</span>
                  ) : (
                    <span className="type-badge rep">Representante</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan={2}>
                <strong>Total ({getSortedAndFilteredDetails().length} registros)</strong>
              </td>
              <td className="number emphasized">
                <strong>
                  {formatNumber(getSortedAndFilteredDetails().reduce((sum, d) => sum + (d.cantEnviar || 0), 0))}
                </strong>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}