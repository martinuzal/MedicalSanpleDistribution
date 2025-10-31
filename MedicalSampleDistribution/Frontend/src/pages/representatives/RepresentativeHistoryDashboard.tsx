import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Bar, Area, Cell } from 'recharts';
import { LineChart, BarChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { representativesService } from '../../services/representativesService';
import { useNotifications } from '../../contexts/NotificationContext';
import type { RepresentativeHistory, RepresentativeHistoryItem } from '../../types/representatives';
import './RepresentativeHistoryDashboard.css';

export default function RepresentativeHistoryDashboard() {
  const { repCode } = useParams<{ repCode: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [historyData, setHistoryData] = useState<RepresentativeHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [splitPosition, setSplitPosition] = useState(350); // Initial sidebar width
  const [isDragging, setIsDragging] = useState(false);

  // Filters
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

  useEffect(() => {
    if (repCode) {
      loadHistory(parseInt(repCode));
    }
  }, [repCode]);

  const loadHistory = async (code: number) => {
    try {
      setLoading(true);
      const data = await representativesService.getRepresentativeHistory(code);
      setHistoryData(data);

      // Set initial date range
      if (data.history.length > 0) {
        const dates = data.history.map(h => new Date(h.importDate));
        const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        setDateRange({
          start: minDate.toISOString().split('T')[0],
          end: maxDate.toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error loading representative history:', error);
      addNotification('Error al cargar el histórico del representante', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    if (!historyData) return [];

    let filtered = historyData.history;

    // Filter by material
    if (selectedMaterial) {
      filtered = filtered.filter(item => item.codigoSap === selectedMaterial);
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(item => new Date(item.importDate) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(item => new Date(item.importDate) <= new Date(dateRange.end));
    }

    return filtered;
  }, [historyData, selectedMaterial, dateRange]);

  // Get unique materials
  const materials = useMemo(() => {
    if (!historyData) return [];
    const uniqueMaterials = new Map<string, string>();
    historyData.history.forEach(item => {
      if (item.codigoSap && item.material) {
        uniqueMaterials.set(item.codigoSap, item.material);
      }
    });
    return Array.from(uniqueMaterials.entries()).map(([code, name]) => ({ code, name }));
  }, [historyData]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSent = filteredData.reduce((sum, item) => sum + item.cantEnviar, 0);
    const uniqueMaterials = new Set(filteredData.map(item => item.codigoSap)).size;
    const uniqueDates = new Set(filteredData.map(item => new Date(item.importDate).toISOString().split('T')[0])).size;
    const lastSent = filteredData.length > 0
      ? new Date(Math.max(...filteredData.map(item => new Date(item.importDate).getTime())))
      : null;
    const avgPerSend = uniqueDates > 0 ? totalSent / uniqueDates : 0;

    return {
      totalSent,
      uniqueMaterials,
      lastSent,
      avgPerSend: Math.round(avgPerSend),
      totalSends: uniqueDates,
    };
  }, [filteredData]);

  // Get top 10 materials from ALL data (not filtered by material selection)
  // This ensures color consistency even when a material is selected
  const top10MaterialsList = useMemo(() => {
    if (!historyData) return [];

    // Use ALL history data, but respect date filters
    let dataForTop10 = historyData.history;

    // Apply date filters only
    if (dateRange.start) {
      dataForTop10 = dataForTop10.filter(item => new Date(item.importDate) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      dataForTop10 = dataForTop10.filter(item => new Date(item.importDate) <= new Date(dateRange.end));
    }

    const materialTotals = new Map<string, number>();
    dataForTop10.forEach(item => {
      const material = item.material || 'Sin nombre';
      const current = materialTotals.get(material) || 0;
      materialTotals.set(material, current + item.cantEnviar);
    });

    return Array.from(materialTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([material, cantidad]) => ({ material, cantidad }));
  }, [historyData, dateRange]);

  // Prepare timeline data (aggregated by date and material) - Limited to top 10 materials
  const timelineData = useMemo(() => {
    const top10Materials = top10MaterialsList.map(item => item.material);

    // Group by date, but only for top 10 materials
    const grouped = new Map<string, Map<string, number>>();

    filteredData.forEach(item => {
      const date = new Date(item.importDate).toISOString().split('T')[0];
      const material = item.material || 'Sin nombre';

      // Only include top 10 materials
      if (!top10Materials.includes(material)) return;

      if (!grouped.has(date)) {
        grouped.set(date, new Map());
      }

      const dateGroup = grouped.get(date)!;
      const current = dateGroup.get(material) || 0;
      dateGroup.set(material, current + item.cantEnviar);
    });

    const result: any[] = [];
    grouped.forEach((materials, date) => {
      const entry: any = { date };
      materials.forEach((cantidad, material) => {
        entry[material] = cantidad;
      });
      result.push(entry);
    });

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData, top10MaterialsList]);

  // Material colors for charts - based on top 10 materials order
  const materialColors = useMemo(() => {
    const colors = [
      '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
    ];

    const colorMap: Record<string, string> = {};
    top10MaterialsList.forEach(({ material }, index) => {
      colorMap[material] = colors[index % colors.length];
    });
    return colorMap;
  }, [top10MaterialsList]);

  // Selected material info (name and color)
  const selectedMaterialInfo = useMemo(() => {
    if (!selectedMaterial) return null;
    const material = materials.find(m => m.code === selectedMaterial);
    if (!material) return null;

    console.log('Selected material code:', selectedMaterial);
    console.log('Found material:', material);
    console.log('Material name:', material.name);
    console.log('Material colors map:', materialColors);
    console.log('Color for this material:', materialColors[material.name]);

    return {
      name: material.name,
      color: materialColors[material.name] || '#4f46e5'
    };
  }, [selectedMaterial, materials, materialColors]);

  // Timeline data for single selected material
  const singleMaterialTimelineData = useMemo(() => {
    if (!selectedMaterialInfo) return [];

    const grouped = new Map<string, number>();

    filteredData.forEach(item => {
      const date = new Date(item.importDate).toISOString().split('T')[0];
      const material = item.material || 'Sin nombre';

      // Only include the selected material
      if (material !== selectedMaterialInfo.name) return;

      const current = grouped.get(date) || 0;
      grouped.set(date, current + item.cantEnviar);
    });

    const result: any[] = [];
    grouped.forEach((cantidad, date) => {
      result.push({
        date,
        cantidad
      });
    });

    console.log('Single material timeline data:', result);
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredData, selectedMaterialInfo]);

  // Prepare top materials data for bar chart
  const topMaterialsData = useMemo(() => {
    return top10MaterialsList;
  }, [top10MaterialsList]);

  // Export functions
  const exportToCSV = useCallback(() => {
    if (filteredData.length === 0) {
      addNotification('No hay datos para exportar', 'warning');
      return;
    }

    const headers = ['Código', 'Representante', 'Supervisor', 'Región', 'Material', 'Código SAP', 'Fecha', 'Estado', 'Cantidad'];
    const rows = filteredData.map(item => [
      item.code,
      item.representante || '',
      item.supervisor || '',
      item.region || '',
      item.material || '',
      item.codigoSap || '',
      item.importDate,
      item.state || '',
      item.cantEnviar
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rep_${repCode}_historico_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    addNotification('Exportación completada', 'success');
  }, [filteredData, repCode, addNotification]);

  // Split panel handlers
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = e.clientX;
    if (newWidth >= 300 && newWidth <= 600) {
      setSplitPosition(newWidth);
    }
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  if (loading) {
    return (
      <div className="rep-history-dashboard loading">
        <div className="loading-spinner">Cargando histórico...</div>
      </div>
    );
  }

  if (!historyData) {
    return (
      <div className="rep-history-dashboard error">
        <div className="error-message">No se pudo cargar el histórico</div>
      </div>
    );
  }

  return (
    <div className="rep-history-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar" style={{ width: `${splitPosition}px` }}>
        <div className="sidebar-header">
          <button className="btn-back" onClick={() => navigate('/representantes')}>
            <span className="material-icons">arrow_back</span>
            Volver
          </button>
        </div>

        <div className="sidebar-content">
          <div className="rep-info-card">
            <h2>{historyData.representativeInfo?.name}</h2>
            <div className="rep-info-details">
              <div className="info-row">
                <span className="material-icons">badge</span>
                <span>Código: {historyData.representativeInfo?.code}</span>
              </div>
              <div className="info-row">
                <span className="material-icons">supervisor_account</span>
                <span>{historyData.representativeInfo?.supervisor}</span>
              </div>
              <div className="info-row">
                <span className="material-icons">public</span>
                <span>{historyData.representativeInfo?.region}</span>
              </div>
            </div>
          </div>

          <div className="filters-section">
            <h3>Filtros</h3>

            <div className="filter-group">
              <label htmlFor="material-filter">
                <span className="material-icons">inventory_2</span>
                Material
              </label>
              <select
                id="material-filter"
                value={selectedMaterial || ''}
                onChange={(e) => setSelectedMaterial(e.target.value || null)}
                className="filter-select"
              >
                <option value="">Todos los materiales</option>
                {materials.map(mat => (
                  <option key={mat.code} value={mat.code}>
                    {mat.name} ({mat.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date-start">
                <span className="material-icons">calendar_today</span>
                Desde
              </label>
              <input
                id="date-start"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="date-end">
                <span className="material-icons">event</span>
                Hasta
              </label>
              <input
                id="date-end"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="filter-input"
              />
            </div>

            {(selectedMaterial || dateRange.start || dateRange.end) && (
              <button
                className="btn-clear-filters"
                onClick={() => {
                  setSelectedMaterial(null);
                  if (historyData.history.length > 0) {
                    const dates = historyData.history.map(h => new Date(h.importDate));
                    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
                    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
                    setDateRange({
                      start: minDate.toISOString().split('T')[0],
                      end: maxDate.toISOString().split('T')[0],
                    });
                  }
                }}
              >
                <span className="material-icons">clear_all</span>
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="sidebar-actions">
            <button className="btn-export btn-csv" onClick={exportToCSV}>
              <span className="material-icons">file_download</span>
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Resizer */}
      <div
        className={`dashboard-resizer ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="resizer-handle"></div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Histórico de Envíos</h1>
          <p className="dashboard-subtitle">
            Análisis detallado de materiales enviados al representante
          </p>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <span className="material-icons">local_shipping</span>
            </div>
            <div className="kpi-content">
              <div className="kpi-value">{kpis.totalSent.toLocaleString()}</div>
              <div className="kpi-label">Total Enviado</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <span className="material-icons">inventory_2</span>
            </div>
            <div className="kpi-content">
              <div className="kpi-value">{kpis.uniqueMaterials}</div>
              <div className="kpi-label">Materiales Únicos</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <span className="material-icons">event_available</span>
            </div>
            <div className="kpi-content">
              <div className="kpi-value">{kpis.totalSends}</div>
              <div className="kpi-label">Total de Envíos</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
              <span className="material-icons">calculate</span>
            </div>
            <div className="kpi-content">
              <div className="kpi-value">{kpis.avgPerSend}</div>
              <div className="kpi-label">Promedio por Envío</div>
            </div>
          </div>
        </div>

        {/* Top Materials Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top 10 Materiales Más Enviados</h3>
            <span className="chart-subtitle">Distribución de cantidades por material (click para filtrar)</span>
          </div>
          <div className="chart-container" style={{ height: '500px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topMaterialsData}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" />
                <YAxis
                  dataKey="material"
                  type="category"
                  width={250}
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                />
                <Bar
                  dataKey="cantidad"
                  radius={[0, 8, 8, 0]}
                  cursor="pointer"
                  fillOpacity={0.6}
                  onClick={(data) => {
                    console.log('Click en barra:', data);
                    if (data && data.material) {
                      const materialName = data.material;
                      console.log('Material clickeado:', materialName);
                      console.log('Lista de materiales:', materials);
                      // Find the material code by name
                      const material = materials.find(m => m.name === materialName);
                      console.log('Material encontrado:', material);
                      if (material) {
                        setSelectedMaterial(material.code);
                        addNotification(`Filtro aplicado: ${materialName}`, 'success');
                      } else {
                        console.warn('Material no encontrado en la lista');
                        addNotification(`No se pudo aplicar el filtro para: ${materialName}`, 'warning');
                      }
                    }
                  }}
                >
                  {topMaterialsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={materialColors[entry.material] || '#4f46e5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Chart */}
        {selectedMaterial && selectedMaterialInfo ? (
          <div className="chart-card">
            <div className="chart-header">
              <h3>Evolución Temporal - {selectedMaterialInfo.name}</h3>
              <span className="chart-subtitle">Cantidad enviada a lo largo del tiempo</span>
            </div>
            <div className="chart-container" style={{ height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={singleMaterialTimelineData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedMaterialInfo.color} stopOpacity={0.6}/>
                      <stop offset="95%" stopColor={selectedMaterialInfo.color} stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      });
                    }}
                    formatter={(value: any) => [value, selectedMaterialInfo.name]}
                  />
                  <Area
                    type="monotone"
                    dataKey="cantidad"
                    stroke={selectedMaterialInfo.color}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="chart-card">
            <div className="chart-header">
              <h3>Evolución Temporal por Material (Top 10)</h3>
              <span className="chart-subtitle">Distribución acumulada de envíos a lo largo del tiempo</span>
            </div>
            <div className="chart-container" style={{ height: '500px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    {Object.entries(materialColors).map(([material, color]) => (
                      <linearGradient key={material} id={`color-${material.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.6}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      });
                    }}
                    formatter={(value: any) => [value, 'Cantidad']}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{
                      paddingBottom: '20px',
                      fontSize: '11px'
                    }}
                    iconType="square"
                    iconSize={12}
                  />
                  {Object.keys(materialColors).map(material => (
                    <Area
                      key={material}
                      type="monotone"
                      dataKey={material}
                      stackId="1"
                      stroke={materialColors[material]}
                      fill={`url(#color-${material.replace(/[^a-zA-Z0-9]/g, '')})`}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Materials Table */}
        <div className="table-card">
          <div className="table-header">
            <h3>Detalle de Materiales</h3>
            <span className="table-subtitle">Cantidad total por material en el período seleccionado</span>
          </div>
          <div className="table-container">
            <table className="materials-table">
              <thead>
                <tr>
                  <th>Código SAP</th>
                  <th>Material</th>
                  <th className="text-right">Cantidad Total</th>
                  <th className="text-right">N° de Envíos</th>
                  <th className="text-right">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  filteredData.reduce((acc, item) => {
                    const key = item.codigoSap || 'N/A';
                    if (!acc.has(key)) {
                      acc.set(key, {
                        codigo: item.codigoSap || 'N/A',
                        material: item.material || 'Sin nombre',
                        total: 0,
                        count: 0,
                      });
                    }
                    const data = acc.get(key)!;
                    data.total += item.cantEnviar;
                    data.count += 1;
                    return acc;
                  }, new Map<string, { codigo: string; material: string; total: number; count: number }>())
                ).map(([key, data]) => (
                  <tr key={key}>
                    <td>
                      <span className="material-code">{data.codigo}</span>
                    </td>
                    <td>
                      <span className="material-name">{data.material}</span>
                    </td>
                    <td className="text-right">
                      <span className="quantity-badge">{data.total.toLocaleString()}</span>
                    </td>
                    <td className="text-right">{data.count}</td>
                    <td className="text-right">{Math.round(data.total / data.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

