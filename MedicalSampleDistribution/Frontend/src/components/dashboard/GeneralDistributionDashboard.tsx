import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MaterialDetailDashboard, MaterialDetailByRepSup } from '../../types/materialDetailDashboard';
import type { CriteriosList } from '../../types/criterios';
import { materialDetailDashboardService } from '../../services/materialDetailDashboardService';
import { criteriosService } from '../../services/criteriosService';
import { useNotifications } from '../../contexts/NotificationContext';
import { ResponsiveBar } from '@nivo/bar';
import './MaterialDetailDashboard.css';

type TabType = 'materials' | 'representatives';

export default function GeneralDistributionDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<MaterialDetailDashboard | null>(null);
  const [criterios, setCriterios] = useState<CriteriosList | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('materials');
  const [sortField, setSortField] = useState<keyof MaterialDetailByRepSup>('supervisor');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterSupervisor, setFilterSupervisor] = useState<string | null>(null);
  const [filterRepresentative, setFilterRepresentative] = useState<string | null>(null);
  const [filterMaterial, setFilterMaterial] = useState<string | null>(null);
  const [filterCriterio, setFilterCriterio] = useState<string | null>(null);
  const [showOnlyJefes, setShowOnlyJefes] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (id) {
      loadDashboard(parseInt(id));
    }
  }, [id]);

  const loadDashboard = async (importId: number) => {
    try {
      setLoading(true);
      const [dashboardData, criteriosData] = await Promise.all([
        materialDetailDashboardService.getGeneralDistributionDashboard(importId),
        criteriosService.getCriterios(importId)
      ]);
      console.log('Dashboard data:', dashboardData);
      console.log('Criterios data:', criteriosData);
      console.log('Sample dashboard detail:', dashboardData.details[0]);
      console.log('Sample criterio:', criteriosData.criterios[0]);
      setDashboard(dashboardData);
      setCriterios(criteriosData);
    } catch (error) {
      addNotification('Error al cargar dashboard de distribución general', 'error');
      console.error('Error loading general distribution dashboard:', error);
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

    // Filter by material if selected
    if (filterMaterial) {
      filtered = filtered.filter(d => d.materialId === filterMaterial);
    }

    // Filter by criterio if selected
    if (filterCriterio && criterios) {
      const materialsInCriterio = criterios.criterios
        .filter(c => c.criterio === filterCriterio)
        .map(c => c.materialId?.trim().toUpperCase()).filter(m => m);
      filtered = filtered.filter(d => {
        const match = d.materialId?.match(/\[([^\]]+)\]/);
        const materialCode = match ? match[1].trim().toUpperCase() : d.materialId?.trim().toUpperCase();
        return materialsInCriterio.includes(materialCode);
      });
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

  // Get total unique materials
  const getTotalMaterials = () => {
    if (!dashboard) return 0;
    return getUniqueMaterials().length;
  };

  const formatNumber = (value: number | null) => {
    if (value === null) return '-';
    return value.toLocaleString('es-ES');
  };

  const getUniqueSupervisors = () => {
    if (!dashboard) return [];
    const supervisors = [...new Set(dashboard.details.map(d => d.supervisor).filter(s => s !== null))];
    console.log('Unique supervisors:', supervisors);
    return supervisors.sort();
  };

  const getUniqueRepresentatives = () => {
    if (!dashboard) return [];
    const representatives = [...new Set(dashboard.details.map(d => d.representativeCode).filter(r => r !== null))];
    return representatives.sort();
  };

  const getUniqueMaterials = () => {
    if (!dashboard) return [];
    return [...new Set(dashboard.details.map(d => d.materialId).filter(m => m !== null))];
  };

  const getRowClass = (detail: MaterialDetailByRepSup) => {
    if (detail.isJefe === 1) return 'jefe-row';
    return '';
  };

  const getUniqueCriterios = () => {
    if (!criterios) return [];
    const uniqueCrits = [...new Set(criterios.criterios.map(c => c.criterio).filter(c => c !== null))];
    console.log('Unique criterios:', uniqueCrits);
    return uniqueCrits;
  };

  const getMaterialsByCriterio = (criterio: string) => {
    if (!criterios) return [];
    return criterios.criterios
      .filter(c => c.criterio === criterio)
      .map(c => ({ materialId: c.materialId, material: c.material }));
  };

  const getMaterialCountByCriterio = (criterio: string) => {
    return new Set(getMaterialsByCriterio(criterio).map(m => m.materialId)).size;
  };

  const getRepresentativesBySupervisor = () => {
    if (!dashboard) return new Map<string, number>();
    const map = new Map<string, number>();
    dashboard.details.forEach(d => {
      if (d.supervisor) {
        map.set(d.supervisor, (map.get(d.supervisor) || 0) + 1);
      }
    });
    return map;
  };

  const getCriterioChartData = (criterio: string) => {
    if (!dashboard) return [];
    const materials = getMaterialsByCriterio(criterio);

    return materials.slice(0, 10).map(m => {
      const totalCant = dashboard.details
        .filter(d => d.materialId === m.materialId)
        .reduce((sum, d) => sum + (d.cantEnviar || 0), 0);

      return {
        material: m.materialId || '',
        cantidad: totalCant
      };
    });
  };

  const topMaterialsByQuantity = useMemo(() => {
    if (!dashboard) return [];

    const materialTotals = new Map<string, number>();

    let filteredDetails = dashboard.details;

    // Apply criterio filter if selected
    if (filterCriterio && criterios) {
      console.log('=== FILTERING BY CRITERIO ===');
      console.log('Selected criterio:', filterCriterio);

      const materialsInCriterio = criterios.criterios
        .filter(c => c.criterio === filterCriterio)
        .map(c => c.materialId);

      console.log('Materials IDs in this criterio:', materialsInCriterio);
      console.log('Sample material from criterio:', materialsInCriterio[0]);
      console.log('Sample materialId from dashboard:', filteredDetails[0]?.materialId);
      console.log('Total details before filter:', filteredDetails.length);

      // Extract material code from dashboard format: [CODE] Description
      // Dashboard: '[0078M] SINALGICO 20 MG. X  2 C. (M)'
      // Criterios: '0799m'
      const normalizedCriterioMaterials = materialsInCriterio
        .map(m => m?.trim().toUpperCase())
        .filter(m => m);
      console.log('Normalized criterio materials:', normalizedCriterioMaterials);

      filteredDetails = filteredDetails.filter(d => {
        // Extract code from [CODE] format
        const match = d.materialId?.match(/\[([^\]]+)\]/);
        const materialCode = match ? match[1].trim().toUpperCase() : d.materialId?.trim().toUpperCase();
        const includes = normalizedCriterioMaterials.includes(materialCode);
        if (includes) {
          console.log(`✓ Material ${d.materialId} matched with code ${materialCode}`);
        }
        return includes;
      });

      console.log('Total details after filter:', filteredDetails.length);
    }

    filteredDetails.forEach(d => {
      if (d.materialId) {
        const current = materialTotals.get(d.materialId) || 0;
        materialTotals.set(d.materialId, current + (d.cantEnviar || 0));
      }
    });

    return Array.from(materialTotals.entries())
      .map(([material, cantidad]) => ({ material, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 15);
  }, [dashboard, filterCriterio, criterios]);

  const materialsBySupervisor = useMemo(() => {
    if (!dashboard) return [];

    const supervisorTotals = new Map<string, number>();

    let filteredDetails = dashboard.details;

    // Apply criterio filter if selected
    if (filterCriterio && criterios) {
      const materialsInCriterio = criterios.criterios
        .filter(c => c.criterio === filterCriterio)
        .map(c => c.materialId?.trim().toUpperCase()).filter(m => m);
      filteredDetails = filteredDetails.filter(d => {
        const match = d.materialId?.match(/\[([^\]]+)\]/);
        const materialCode = match ? match[1].trim().toUpperCase() : d.materialId?.trim().toUpperCase();
        return materialsInCriterio.includes(materialCode);
      });
    }

    filteredDetails.forEach(d => {
      if (d.supervisor) {
        const current = supervisorTotals.get(d.supervisor) || 0;
        supervisorTotals.set(d.supervisor, current + (d.cantEnviar || 0));
      }
    });

    return Array.from(supervisorTotals.entries())
      .map(([supervisor, cantidad]) => ({ supervisor, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);
  }, [dashboard, filterCriterio, criterios]);

  const filteredMaterialsList = useMemo(() => {
    if (!dashboard) return [];

    let filteredDetails = dashboard.details;

    // Apply criterio filter if selected
    if (filterCriterio && criterios) {
      const materialsInCriterio = criterios.criterios
        .filter(c => c.criterio === filterCriterio)
        .map(c => c.materialId?.trim().toUpperCase()).filter(m => m);
      filteredDetails = filteredDetails.filter(d => {
        const match = d.materialId?.match(/\[([^\]]+)\]/);
        const materialCode = match ? match[1].trim().toUpperCase() : d.materialId?.trim().toUpperCase();
        return materialsInCriterio.includes(materialCode);
      });
    }

    // Group by material
    const materialMap = new Map<string, {
      materialId: string;
      totalCantidad: number;
      representantes: number;
      supervisores: Set<string>;
    }>();

    filteredDetails.forEach(d => {
      if (d.materialId) {
        if (!materialMap.has(d.materialId)) {
          materialMap.set(d.materialId, {
            materialId: d.materialId,
            totalCantidad: 0,
            representantes: 0,
            supervisores: new Set()
          });
        }

        const mat = materialMap.get(d.materialId)!;
        mat.totalCantidad += d.cantEnviar || 0;
        mat.representantes += 1;
        if (d.supervisor) {
          mat.supervisores.add(d.supervisor);
        }
      }
    });

    return Array.from(materialMap.values())
      .map(m => ({
        ...m,
        supervisoresCount: m.supervisores.size
      }))
      .sort((a, b) => b.totalCantidad - a.totalCantidad);
  }, [dashboard, filterCriterio, criterios]);

  // Representatives tab data - requires supervisor OR representative filter
  const representativesViewData = useMemo(() => {
    if (!dashboard) return null;

    // Require at least supervisor or representative filter
    if (!filterSupervisor && !filterRepresentative) {
      return null;
    }

    let filteredDetails = dashboard.details;

    // Apply filters
    if (filterSupervisor) {
      filteredDetails = filteredDetails.filter(d => d.supervisor === filterSupervisor);
    }

    if (filterRepresentative) {
      filteredDetails = filteredDetails.filter(d => d.representativeCode === filterRepresentative);
    }

    if (filteredDetails.length === 0) return null;

    // Calculate statistics
    const totalCantidad = filteredDetails.reduce((sum, d) => sum + (d.cantEnviar || 0), 0);
    const uniqueMaterials = new Set(filteredDetails.map(d => d.materialId).filter(m => m));
    const uniqueRepresentatives = new Set(filteredDetails.map(d => d.representativeCode).filter(r => r));
    const uniqueSupervisors = new Set(filteredDetails.map(d => d.supervisor).filter(s => s));

    // Top materials by quantity
    const materialTotals = new Map<string, number>();
    filteredDetails.forEach(d => {
      if (d.materialId) {
        const current = materialTotals.get(d.materialId) || 0;
        materialTotals.set(d.materialId, current + (d.cantEnviar || 0));
      }
    });
    const topMaterials = Array.from(materialTotals.entries())
      .map(([material, cantidad]) => ({ material, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);

    // Distribution by representative (only if supervisor is selected and no specific representative)
    const repDistribution = filterSupervisor && !filterRepresentative ?
      (() => {
        const repTotals = new Map<string, number>();
        filteredDetails.forEach(d => {
          if (d.representativeCode) {
            const current = repTotals.get(d.representativeCode) || 0;
            repTotals.set(d.representativeCode, current + (d.cantEnviar || 0));
          }
        });
        return Array.from(repTotals.entries())
          .map(([representative, cantidad]) => ({ representative, cantidad }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 10);
      })() : [];

    // Grouped by material for table
    const materialGroups = (() => {
      const groups = new Map<string, {
        materialId: string;
        totalCantidad: number;
        representatives: Map<string, number>;
      }>();

      filteredDetails.forEach(d => {
        if (d.materialId && d.representativeCode) {
          if (!groups.has(d.materialId)) {
            groups.set(d.materialId, {
              materialId: d.materialId,
              totalCantidad: 0,
              representatives: new Map()
            });
          }

          const group = groups.get(d.materialId)!;
          group.totalCantidad += d.cantEnviar || 0;

          const repCurrent = group.representatives.get(d.representativeCode) || 0;
          group.representatives.set(d.representativeCode, repCurrent + (d.cantEnviar || 0));
        }
      });

      return Array.from(groups.values())
        .sort((a, b) => b.totalCantidad - a.totalCantidad);
    })();

    return {
      totalCantidad,
      materialsCount: uniqueMaterials.size,
      representativesCount: uniqueRepresentatives.size,
      supervisorsCount: uniqueSupervisors.size,
      topMaterials,
      repDistribution,
      materialGroups,
      filterType: filterRepresentative ? 'representative' : 'supervisor'
    };
  }, [dashboard, filterSupervisor, filterRepresentative]);

  if (loading) {
    return (
      <div className="material-detail-dashboard">
        <div className="loading">Cargando dashboard de distribución general...</div>
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
          <button className="btn-back" onClick={() => navigate('/marcaciones')}>
            <span className="material-icons">arrow_back</span>
            Volver a Marcaciones
          </button>
          <h1>Dashboard de Distribución General</h1>
          <p className="page-description">
            Marcación ID: {dashboard.importId}
          </p>
          <h2 className="material-title">Todos los materiales</h2>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid-compact">
        <div className="summary-card-compact highlight">
          <div className="summary-icon-compact">
            <span className="material-icons">category</span>
          </div>
          <div className="summary-content-compact">
            <div className="summary-value-compact">{formatNumber(getTotalMaterials())}</div>
            <div className="summary-label-compact">Materiales</div>
          </div>
        </div>

        <div className="summary-card-compact">
          <div className="summary-icon-compact">
            <span className="material-icons">assignment</span>
          </div>
          <div className="summary-content-compact">
            <div className="summary-value-compact">{formatNumber(dashboard.summary.totalRecords)}</div>
            <div className="summary-label-compact">Registros</div>
          </div>
        </div>

        <div className="summary-card-compact">
          <div className="summary-icon-compact">
            <span className="material-icons">person</span>
          </div>
          <div className="summary-content-compact">
            <div className="summary-value-compact">{formatNumber(dashboard.summary.totalRepresentantes)}</div>
            <div className="summary-label-compact">Representantes</div>
          </div>
        </div>

        <div className="summary-card-compact">
          <div className="summary-icon-compact">
            <span className="material-icons">supervisor_account</span>
          </div>
          <div className="summary-content-compact">
            <div className="summary-value-compact">{formatNumber(dashboard.summary.totalSupervisores)}</div>
            <div className="summary-label-compact">Supervisores</div>
          </div>
        </div>

        <div className="summary-card-compact">
          <div className="summary-icon-compact">
            <span className="material-icons">business</span>
          </div>
          <div className="summary-content-compact">
            <div className="summary-value-compact">{formatNumber(dashboard.summary.totalJefes)}</div>
            <div className="summary-label-compact">Delegaciones</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <span className="material-icons">category</span>
          Materiales por Criterio
        </button>
        <button
          className={`tab-button ${activeTab === 'representatives' ? 'active' : ''}`}
          onClick={() => setActiveTab('representatives')}
        >
          <span className="material-icons">people</span>
          Representantes
        </button>
      </div>

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <>
          {/* Filters for Materials */}
          <div className="filters-section-enhanced">
            <div className="filter-header">
              <span className="material-icons">filter_list</span>
              <span className="filter-title">Filtros</span>
            </div>
            <div className="filter-group-enhanced">
              <label htmlFor="criterio-filter">
                <span className="material-icons">rule</span>
                Criterio
              </label>
              <select
                id="criterio-filter"
                value={filterCriterio || ''}
                onChange={(e) => setFilterCriterio(e.target.value || null)}
                className="filter-select-enhanced"
              >
                <option value="">Todos los criterios</option>
                {getUniqueCriterios().map(criterio => (
                  <option key={criterio} value={criterio || ''}>
                    {criterio}
                  </option>
                ))}
              </select>
            </div>
            {filterCriterio && (
              <button
                className="btn-clear-filter"
                onClick={() => setFilterCriterio(null)}
                title="Limpiar filtro"
              >
                <span className="material-icons">clear</span>
                Limpiar
              </button>
            )}
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Top Materials Chart */}
            <div className="chart-container">
              <h2>Top 15 Materiales por Cantidad</h2>
              <div style={{ height: '400px' }}>
                <ResponsiveBar
                  data={topMaterialsByQuantity}
                  keys={['cantidad']}
                  indexBy="material"
                  margin={{ top: 20, right: 20, bottom: 80, left: 80 }}
                  padding={0.3}
                  colors="#4a9eff"
                  borderRadius={6}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad',
                    legendPosition: 'middle',
                    legendOffset: -60
                  }}
                  label={(d) => `${d.value}`}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  enableGridY={true}
                  theme={{
                    labels: {
                      text: {
                        fontSize: 12,
                        fontWeight: 600
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Distribution by Supervisor Chart */}
            <div className="chart-container">
              <h2>Distribución por Supervisor</h2>
              <div style={{ height: '400px' }}>
                <ResponsiveBar
                  data={materialsBySupervisor}
                  keys={['cantidad']}
                  indexBy="supervisor"
                  margin={{ top: 20, right: 20, bottom: 80, left: 80 }}
                  padding={0.3}
                  colors="#9b59b6"
                  borderRadius={6}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Cantidad Total',
                    legendPosition: 'middle',
                    legendOffset: -60
                  }}
                  label={(d) => `${d.value}`}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  enableGridY={true}
                  theme={{
                    labels: {
                      text: {
                        fontSize: 12,
                        fontWeight: 600
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Materials List Table */}
          <div className="table-container" style={{ marginTop: '2rem' }}>
            <h2 style={{ padding: '1rem', margin: 0, background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
              Lista de Materiales
            </h2>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th style={{ textAlign: 'right' }}>Cantidad Total</th>
                  <th style={{ textAlign: 'center' }}>Representantes</th>
                  <th style={{ textAlign: 'center' }}>Supervisores</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterialsList.map((material, index) => (
                  <tr key={index}>
                    <td className="representative-name">{material.materialId}</td>
                    <td className="number emphasized">{formatNumber(material.totalCantidad)}</td>
                    <td className="number">{material.representantes}</td>
                    <td className="number">{material.supervisoresCount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan={4}>
                    <strong>Total de materiales: {filteredMaterialsList.length}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* Representatives Tab */}
      {activeTab === 'representatives' && (
        <>
          {/* Filters for Representatives - Required */}
          <div className="filters-section-enhanced">
            <div className="filter-header">
              <span className="material-icons">filter_list</span>
              <span className="filter-title">Seleccione un Supervisor o Representante</span>
            </div>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              margin: '0 0 1rem 0',
              fontStyle: 'italic'
            }}>
              Para visualizar los datos, debe seleccionar al menos un supervisor o un representante específico.
            </p>

            <div className="filters-grid-enhanced">
              <div className="filter-group-enhanced">
                <label htmlFor="supervisor-filter-rep">
                  <span className="material-icons">supervisor_account</span>
                  Supervisor
                </label>
                <select
                  id="supervisor-filter-rep"
                  value={filterSupervisor || ''}
                  onChange={(e) => {
                    setFilterSupervisor(e.target.value || null);
                    // Clear representative when supervisor changes
                    if (e.target.value) setFilterRepresentative(null);
                  }}
                  className="filter-select-enhanced"
                  style={{
                    borderColor: !filterSupervisor && !filterRepresentative ? '#ff6b6b' : undefined,
                    borderWidth: !filterSupervisor && !filterRepresentative ? '2px' : undefined
                  }}
                >
                  <option value="">-- Seleccione Supervisor --</option>
                  {getUniqueSupervisors().map(supervisor => (
                    <option key={supervisor} value={supervisor || ''}>
                      {supervisor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group-enhanced">
                <label htmlFor="representative-filter">
                  <span className="material-icons">person</span>
                  Representante
                </label>
                <select
                  id="representative-filter"
                  value={filterRepresentative || ''}
                  onChange={(e) => {
                    setFilterRepresentative(e.target.value || null);
                    // Clear supervisor when representative is selected
                    if (e.target.value) setFilterSupervisor(null);
                  }}
                  className="filter-select-enhanced"
                  style={{
                    borderColor: !filterSupervisor && !filterRepresentative ? '#ff6b6b' : undefined,
                    borderWidth: !filterSupervisor && !filterRepresentative ? '2px' : undefined
                  }}
                >
                  <option value="">-- Seleccione Representante --</option>
                  {getUniqueRepresentatives().map(rep => (
                    <option key={rep} value={rep || ''}>
                      {rep}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Content based on filter selection */}
          {!representativesViewData ? (
            <div style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius)',
              border: '2px dashed var(--border-color)',
              margin: '2rem 0'
            }}>
              <span className="material-icons" style={{ fontSize: '4rem', color: 'var(--text-secondary)', opacity: 0.5 }}>
                filter_alt
              </span>
              <h3 style={{ color: 'var(--text-secondary)', fontWeight: 400, marginTop: '1rem' }}>
                Seleccione un Supervisor o Representante
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Use los filtros arriba para ver el análisis detallado
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards for Selected Filter */}
              <div className="summary-grid-compact" style={{ marginTop: '2rem' }}>
                <div className="summary-card-compact highlight">
                  <div className="summary-icon-compact">
                    <span className="material-icons">inventory_2</span>
                  </div>
                  <div className="summary-content-compact">
                    <div className="summary-value-compact">{formatNumber(representativesViewData.totalCantidad)}</div>
                    <div className="summary-label-compact">Total Unidades</div>
                  </div>
                </div>

                <div className="summary-card-compact">
                  <div className="summary-icon-compact">
                    <span className="material-icons">category</span>
                  </div>
                  <div className="summary-content-compact">
                    <div className="summary-value-compact">{representativesViewData.materialsCount}</div>
                    <div className="summary-label-compact">Materiales</div>
                  </div>
                </div>

                <div className="summary-card-compact">
                  <div className="summary-icon-compact">
                    <span className="material-icons">people</span>
                  </div>
                  <div className="summary-content-compact">
                    <div className="summary-value-compact">{representativesViewData.representativesCount}</div>
                    <div className="summary-label-compact">Representantes</div>
                  </div>
                </div>

                {representativesViewData.filterType === 'supervisor' && (
                  <div className="summary-card-compact">
                    <div className="summary-icon-compact">
                      <span className="material-icons">supervisor_account</span>
                    </div>
                    <div className="summary-content-compact">
                      <div className="summary-value-compact">{filterSupervisor}</div>
                      <div className="summary-label-compact">Supervisor</div>
                    </div>
                  </div>
                )}

                {representativesViewData.filterType === 'representative' && (
                  <div className="summary-card-compact">
                    <div className="summary-icon-compact">
                      <span className="material-icons">person</span>
                    </div>
                    <div className="summary-content-compact">
                      <div className="summary-value-compact">{filterRepresentative}</div>
                      <div className="summary-label-compact">Representante</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Charts Section */}
              <div className="charts-section">
                {/* Top Materials Chart */}
                <div className="chart-container">
                  <h2>Top 10 Materiales {representativesViewData.filterType === 'supervisor' ? 'del Supervisor' : 'del Representante'}</h2>
                  <div style={{ height: '400px' }}>
                    <ResponsiveBar
                      data={representativesViewData.topMaterials}
                      keys={['cantidad']}
                      indexBy="material"
                      margin={{ top: 20, right: 20, bottom: 80, left: 80 }}
                      padding={0.3}
                      colors="#2ecc71"
                      borderRadius={6}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -45
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Cantidad',
                        legendPosition: 'middle',
                        legendOffset: -60
                      }}
                      label={(d) => `${d.value}`}
                      labelSkipWidth={12}
                      labelSkipHeight={12}
                      enableGridY={true}
                      theme={{
                        labels: {
                          text: {
                            fontSize: 12,
                            fontWeight: 600
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Distribution by Representative (only for supervisor view) */}
                {representativesViewData.filterType === 'supervisor' && representativesViewData.repDistribution.length > 0 && (
                  <div className="chart-container">
                    <h2>Distribución por Representante</h2>
                    <div style={{ height: '400px' }}>
                      <ResponsiveBar
                        data={representativesViewData.repDistribution}
                        keys={['cantidad']}
                        indexBy="representative"
                        margin={{ top: 20, right: 20, bottom: 80, left: 80 }}
                        padding={0.3}
                        colors="#e67e22"
                        borderRadius={6}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: -45
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Cantidad Total',
                          legendPosition: 'middle',
                          legendOffset: -60
                        }}
                        label={(d) => `${d.value}`}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        enableGridY={true}
                        theme={{
                          labels: {
                            text: {
                              fontSize: 12,
                              fontWeight: 600
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Materials Table Grouped */}
              <div className="table-container" style={{ marginTop: '2rem' }}>
                <h2 style={{ padding: '1rem', margin: 0, background: 'var(--bg-primary)', borderBottom: '2px solid var(--border-color)' }}>
                  Detalle por Material
                </h2>
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th style={{ textAlign: 'right' }}>Cantidad Total</th>
                      <th style={{ textAlign: 'center' }}>Representantes</th>
                      <th>Detalle por Representante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {representativesViewData.materialGroups.map((group, index) => (
                      <tr key={index}>
                        <td className="representative-name">{group.materialId}</td>
                        <td className="number emphasized">{formatNumber(group.totalCantidad)}</td>
                        <td className="number">{group.representatives.size}</td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {Array.from(group.representatives.entries())
                              .sort((a, b) => b[1] - a[1])
                              .map(([rep, cant]) => (
                                <span
                                  key={rep}
                                  style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    border: '1px solid var(--border-color)'
                                  }}
                                >
                                  {rep}: <strong>{formatNumber(cant)}</strong>
                                </span>
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="total-row">
                      <td colSpan={4}>
                        <strong>Total de materiales: {representativesViewData.materialGroups.length}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}