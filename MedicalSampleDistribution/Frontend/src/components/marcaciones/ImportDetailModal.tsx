import { useState, useEffect } from 'react';
import type { ImportDetail } from '../../types/importDetail';
import { importService } from '../../services/importService';
import { useNotifications } from '../../contexts/NotificationContext';
import './ImportDetailModal.css';

interface ImportDetailModalProps {
  importId: number;
  onClose: () => void;
}

type TabType = 'general' | 'criteria' | 'assignments' | 'materials';

interface CriteriaMaterial {
  rowId: number;
  codigoSap: string;
  description: string;
  quantity: number;
}

export default function ImportDetailModal({ importId, onClose }: ImportDetailModalProps) {
  const [detail, setDetail] = useState<ImportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [selectedCriteriaId, setSelectedCriteriaId] = useState<number | null>(null);
  const [criteriaMaterials, setCriteriaMaterials] = useState<CriteriaMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [assignmentViewMode, setAssignmentViewMode] = useState<'list' | 'grid'>('list');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [assignmentMaterials, setAssignmentMaterials] = useState<CriteriaMaterial[]>([]);
  const [loadingAssignmentMaterials, setLoadingAssignmentMaterials] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadDetail();
  }, [importId]);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const data = await importService.getDetail(importId);
      setDetail(data);
    } catch (error) {
      addNotification('Error al cargar detalle de marcación', 'error');
      console.error('Error loading import detail:', error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString();
  };

  const renderValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return <span className="empty-value">-</span>;
    return <span>{value}</span>;
  };

  const loadCriteriaMaterials = async (criteriaRowId: number) => {
    try {
      console.log('Loading materials for criteriaRowId:', criteriaRowId);
      setLoadingMaterials(true);
      const url = `http://localhost:5001/api/imports/${importId}/criteria/${criteriaRowId}/materials`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al cargar materiales');
      }
      const data = await response.json();
      console.log('Materials loaded:', data);
      setCriteriaMaterials(data);
      setSelectedCriteriaId(criteriaRowId);
    } catch (error) {
      addNotification('Error al cargar materiales del criterio', 'error');
      console.error('Error loading criteria materials:', error);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const loadAssignmentMaterials = async (assignmentRowId: number) => {
    try {
      console.log('Loading materials for assignmentRowId:', assignmentRowId);
      setLoadingAssignmentMaterials(true);
      const url = `http://localhost:5001/api/imports/${importId}/assignments/${assignmentRowId}/materials`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Error al cargar materiales');
      }
      const data = await response.json();
      console.log('Assignment materials loaded:', data);
      setAssignmentMaterials(data);
      setSelectedAssignmentId(assignmentRowId);
    } catch (error) {
      addNotification('Error al cargar materiales de la asignación', 'error');
      console.error('Error loading assignment materials:', error);
    } finally {
      setLoadingAssignmentMaterials(false);
    }
  };

  const getFieldIcon = (field: string): string => {
    const iconMap: Record<string, string> = {
      tipoCliente: 'person',
      campania: 'campaign',
      lugarVisita: 'place',
      institucion: 'business',
      especialidad: 'medical_services',
      edad: 'cake',
      sexo: 'wc',
      especialidadSec: 'local_hospital',
      especialidadCartera: 'work',
      categoria: 'category',
      tarea: 'assignment',
      frecuencia: 'repeat',
      planificacion: 'event_note',
      provincia: 'map',
      tratamiento: 'medication',
      objetosEntregados: 'card_giftcard',
      linea: 'timeline',
      auditCategoria: 'fact_check',
      auditMercado: 'store',
      auditProducto: 'inventory',
      auditMolecula: 'science',
    };
    return iconMap[field] || 'label';
  };

  const getCriteriaFields = (criteria: any) => {
    const fields: Array<{ label: string; value: any; icon: string; key: string }> = [];

    if (criteria.tipoCliente) fields.push({ label: 'Tipo Cliente', value: criteria.tipoCliente, icon: 'person', key: 'tipoCliente' });
    if (criteria.campania) fields.push({ label: 'Campaña', value: criteria.campania, icon: 'campaign', key: 'campania' });
    if (criteria.lugarVisita) fields.push({ label: 'Lugar Visita', value: criteria.lugarVisita, icon: 'place', key: 'lugarVisita' });
    if (criteria.institucion) fields.push({ label: 'Institución', value: criteria.institucion, icon: 'business', key: 'institucion' });
    if (criteria.especialidad) fields.push({ label: 'Especialidad', value: criteria.especialidad, icon: 'medical_services', key: 'especialidad' });
    if (criteria.edad) fields.push({ label: 'Edad', value: criteria.edad, icon: 'cake', key: 'edad' });
    if (criteria.sexo) fields.push({ label: 'Sexo', value: criteria.sexo, icon: 'wc', key: 'sexo' });
    if (criteria.especialidadSec) fields.push({ label: 'Especialidad Sec', value: criteria.especialidadSec, icon: 'local_hospital', key: 'especialidadSec' });
    if (criteria.especialidadCartera) fields.push({ label: 'Especialidad Cartera', value: criteria.especialidadCartera, icon: 'work', key: 'especialidadCartera' });
    if (criteria.categoria) fields.push({ label: 'Categoría', value: criteria.categoria, icon: 'category', key: 'categoria' });
    if (criteria.tarea) fields.push({ label: 'Tarea', value: criteria.tarea, icon: 'assignment', key: 'tarea' });
    if (criteria.frecuencia) fields.push({ label: 'Frecuencia', value: criteria.frecuencia, icon: 'repeat', key: 'frecuencia' });
    if (criteria.planificacion) fields.push({ label: 'Planificación', value: criteria.planificacion, icon: 'event_note', key: 'planificacion' });
    if (criteria.provincia) fields.push({ label: 'Provincia', value: criteria.provincia, icon: 'map', key: 'provincia' });
    if (criteria.tratamiento) fields.push({ label: 'Tratamiento', value: criteria.tratamiento, icon: 'medication', key: 'tratamiento' });
    if (criteria.objetosEntregados) fields.push({ label: 'Objetos Entregados', value: criteria.objetosEntregados, icon: 'card_giftcard', key: 'objetosEntregados' });
    if (criteria.linea) fields.push({ label: 'Línea', value: criteria.linea, icon: 'timeline', key: 'linea' });
    if (criteria.auditCategoria) fields.push({ label: 'Audit Categoría', value: criteria.auditCategoria, icon: 'fact_check', key: 'auditCategoria' });
    if (criteria.auditMercado) fields.push({ label: 'Audit Mercado', value: criteria.auditMercado, icon: 'store', key: 'auditMercado' });
    if (criteria.auditProducto) fields.push({ label: 'Audit Producto', value: criteria.auditProducto, icon: 'inventory', key: 'auditProducto' });
    if (criteria.auditMolecula) fields.push({ label: 'Audit Molécula', value: criteria.auditMolecula, icon: 'science', key: 'auditMolecula' });

    return fields;
  };

  const getAssignmentFields = (assignment: any) => {
    const fields: Array<{ label: string; value: any; icon: string; key: string }> = [];

    if (assignment.supervisor) fields.push({ label: 'Supervisor', value: assignment.supervisor, icon: 'supervisor_account', key: 'supervisor' });
    if (assignment.legajoSupervisor) fields.push({ label: 'Leg. Supervisor', value: assignment.legajoSupervisor, icon: 'badge', key: 'legajoSupervisor' });
    if (assignment.representante) fields.push({ label: 'Representante', value: assignment.representante, icon: 'person', key: 'representante' });
    if (assignment.legajoRepresentante) fields.push({ label: 'Leg. Representante', value: assignment.legajoRepresentante, icon: 'badge', key: 'legajoRepresentante' });
    if (assignment.excluded) fields.push({ label: 'Excluido', value: assignment.excluded, icon: 'block', key: 'excluded' });

    return fields;
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content modal-xl" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Cargando detalle...</div>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-xl" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Detalle de Marcación</h2>
            <p className="modal-subtitle">
              {formatDate(detail.import.importDate)} - {detail.import.state}
            </p>
          </div>
          <button onClick={onClose} className="btn-close">
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="material-icons stat-icon">rule</span>
            <div className="stat-content">
              <div className="stat-value">{detail.statistics.totalCriteria}</div>
              <div className="stat-label">Criterios</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="material-icons stat-icon">person_add</span>
            <div className="stat-content">
              <div className="stat-value">{detail.statistics.totalDirectAssignments}</div>
              <div className="stat-label">Asignaciones Directas</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="material-icons stat-icon">inventory_2</span>
            <div className="stat-content">
              <div className="stat-value">{detail.statistics.totalMaterials}</div>
              <div className="stat-label">Materiales</div>
            </div>
          </div>
          <div className="stat-card">
            <span className="material-icons stat-icon">warehouse</span>
            <div className="stat-content">
              <div className="stat-value">{formatNumber(detail.statistics.totalStock)}</div>
              <div className="stat-label">Stock Total</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <span className="material-icons">info</span>
            General
          </button>
          <button
            className={`tab ${activeTab === 'criteria' ? 'active' : ''}`}
            onClick={() => setActiveTab('criteria')}
          >
            <span className="material-icons">rule</span>
            Criterios ({detail.criteria.length})
          </button>
          <button
            className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignments')}
          >
            <span className="material-icons">person_add</span>
            Asignaciones Directas ({detail.directAssignments.length})
          </button>
          <button
            className={`tab ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <span className="material-icons">inventory_2</span>
            Materiales ({detail.materials.length})
          </button>
        </div>

        <div className="modal-body">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="tab-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Usuario:</label>
                  <span>{detail.import.userName}</span>
                </div>
                <div className="info-item">
                  <label>Fecha:</label>
                  <span>{formatDate(detail.import.importDate)}</span>
                </div>
                <div className="info-item">
                  <label>Estado:</label>
                  <span>{detail.import.state}</span>
                </div>
                <div className="info-item">
                  <label>Archivo Existencia:</label>
                  <span>{renderValue(detail.import.fileNameExistencia)}</span>
                </div>
                <div className="info-item">
                  <label>Archivo Asignación:</label>
                  <span>{renderValue(detail.import.fileNameAsignacion)}</span>
                </div>
                <div className="info-item">
                  <label>Archivo Base:</label>
                  <span>{renderValue(detail.import.fileBase)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Criteria Tab */}
          {activeTab === 'criteria' && (
            <div className="tab-content">
              {detail.criteria.length === 0 ? (
                <div className="no-data">No hay criterios configurados</div>
              ) : (
                <>
                  <div className="view-mode-toolbar">
                    <button
                      className={`btn-view-mode ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <span className="material-icons">view_list</span>
                      Lista
                    </button>
                    <button
                      className={`btn-view-mode ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <span className="material-icons">view_module</span>
                      Mosaico
                    </button>
                  </div>
                  <div className="tab-content-inner">
                    {viewMode === 'list' ? (
                      <table className="criteria-table">
                        <thead>
                          <tr>
                            <th>RowId</th>
                            <th>%</th>
                            <th>Usuario</th>
                            <th>Criterios</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.criteria.map((criteria) => {
                            const fields = getCriteriaFields(criteria);
                            return (
                              <tr key={criteria.id}>
                                <td>
                                  <span className="criteria-number-compact">#{criteria.rowId}</span>
                                </td>
                                <td>
                                  {criteria.porcenDeAplic && (
                                    <span className="criteria-percent-compact">{criteria.porcenDeAplic}%</span>
                                  )}
                                </td>
                                <td>
                                  {criteria.usuarioAlta && (
                                    <span className="criteria-user-badge">
                                      <span className="material-icons">person</span>
                                      {criteria.usuarioAlta}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <div className="criteria-badges-inline">
                                    {fields.map((field) => (
                                      <div key={field.key} className="criteria-badge-small">
                                        <span className="material-icons badge-icon-small">{field.icon}</span>
                                        <span className="badge-content-small">
                                          <span className="badge-label-small">{field.label}:</span>
                                          <span className="badge-value-small">{field.value}</span>
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <button
                                    className="btn-view-materials-small"
                                    onClick={() => {
                                      console.log('Button clicked! RowId:', criteria.rowId);
                                      loadCriteriaMaterials(criteria.rowId!);
                                    }}
                                    title="Ver materiales asignados"
                                  >
                                    <span className="material-icons">inventory_2</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="criteria-grid-compact">
                        {detail.criteria.map((criteria) => {
                          const fields = getCriteriaFields(criteria);
                          return (
                            <div key={criteria.id} className="criteria-row">
                              <div className="criteria-row-header">
                                <div className="criteria-row-header-left">
                                  <span className="criteria-number">#{criteria.rowId}</span>
                                  {criteria.porcenDeAplic && (
                                    <span className="criteria-percent">{criteria.porcenDeAplic}%</span>
                                  )}
                                  {criteria.usuarioAlta && (
                                    <span className="criteria-user-badge">
                                      <span className="material-icons">person</span>
                                      {criteria.usuarioAlta}
                                    </span>
                                  )}
                                </div>
                                <button
                                  className="btn-view-materials-small"
                                  onClick={() => {
                                    console.log('Button clicked (Grid)! RowId:', criteria.rowId);
                                    loadCriteriaMaterials(criteria.rowId!);
                                  }}
                                  title="Ver materiales asignados"
                                >
                                  <span className="material-icons">inventory_2</span>
                                </button>
                              </div>
                              <div className="criteria-badges">
                                {fields.map((field) => (
                                  <div key={field.key} className="criteria-badge">
                                    <span className="material-icons badge-icon">{field.icon}</span>
                                    <span className="badge-content">
                                      <span className="badge-label">{field.label}:</span>
                                      <span className="badge-value">{field.value}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="tab-content">
              {detail.directAssignments.length === 0 ? (
                <div className="no-data">No hay asignaciones directas</div>
              ) : (
                <>
                  <div className="view-mode-toolbar">
                    <button
                      className={`btn-view-mode ${assignmentViewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setAssignmentViewMode('list')}
                    >
                      <span className="material-icons">view_list</span>
                      Lista
                    </button>
                    <button
                      className={`btn-view-mode ${assignmentViewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setAssignmentViewMode('grid')}
                    >
                      <span className="material-icons">view_module</span>
                      Mosaico
                    </button>
                  </div>
                  <div className="tab-content-inner">
                    {assignmentViewMode === 'list' ? (
                      <table className="criteria-table">
                        <thead>
                          <tr>
                            <th>RowId</th>
                            <th>Representante</th>
                            <th>Datos</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.directAssignments.map((assignment) => {
                            const fields = getAssignmentFields(assignment);
                            return (
                              <tr key={assignment.id}>
                                <td>
                                  <span className="criteria-number-compact">#{assignment.rowId}</span>
                                </td>
                                <td>
                                  {assignment.representante && (
                                    <span className="criteria-user-badge">
                                      <span className="material-icons">person</span>
                                      {assignment.representante}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <div className="criteria-badges-inline">
                                    {fields.map((field) => (
                                      <div key={field.key} className="criteria-badge-small">
                                        <span className="material-icons badge-icon-small">{field.icon}</span>
                                        <span className="badge-content-small">
                                          <span className="badge-label-small">{field.label}:</span>
                                          <span className="badge-value-small">{field.value}</span>
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="text-center">
                                  <button
                                    className="btn-view-materials-small"
                                    onClick={() => {
                                      console.log('Button clicked! RowId:', assignment.rowId);
                                      loadAssignmentMaterials(assignment.rowId!);
                                    }}
                                    title="Ver materiales asignados"
                                  >
                                    <span className="material-icons">inventory_2</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="criteria-grid-compact">
                        {detail.directAssignments.map((assignment) => {
                          const fields = getAssignmentFields(assignment);
                          return (
                            <div key={assignment.id} className="criteria-row">
                              <div className="criteria-row-header">
                                <div className="criteria-row-header-left">
                                  <span className="criteria-number">#{assignment.rowId}</span>
                                  {assignment.representante && (
                                    <span className="criteria-user-badge">
                                      <span className="material-icons">person</span>
                                      {assignment.representante}
                                    </span>
                                  )}
                                </div>
                                <button
                                  className="btn-view-materials-small"
                                  onClick={() => {
                                    console.log('Button clicked (Grid)! RowId:', assignment.rowId);
                                    loadAssignmentMaterials(assignment.rowId!);
                                  }}
                                  title="Ver materiales asignados"
                                >
                                  <span className="material-icons">inventory_2</span>
                                </button>
                              </div>
                              <div className="criteria-badges">
                                {fields.map((field) => (
                                  <div key={field.key} className="criteria-badge">
                                    <span className="material-icons badge-icon">{field.icon}</span>
                                    <span className="badge-content">
                                      <span className="badge-label">{field.label}:</span>
                                      <span className="badge-value">{field.value}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="tab-content">
              {detail.materials.length === 0 ? (
                <div className="no-data">No hay materiales configurados</div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Código SAP</th>
                        <th>Descripción</th>
                        <th className="text-right">Pack</th>
                        <th className="text-right">Stock Min</th>
                        <th className="text-right">Stock Max</th>
                        <th className="text-right">Stock Actual</th>
                        <th className="text-center">Usar Stock Real</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.materials.map((material) => (
                        <tr key={material.id}>
                          <td><strong>{material.codigoSap}</strong></td>
                          <td>{material.description}</td>
                          <td className="text-right">{formatNumber(material.pack)}</td>
                          <td className="text-right">{formatNumber(material.minStock)}</td>
                          <td className="text-right">{formatNumber(material.maxStock)}</td>
                          <td className="text-right">
                            <strong className="highlight-value">{formatNumber(material.currentStock)}</strong>
                          </td>
                          <td className="text-center">
                            {material.useStockReal ? (
                              <span className="material-icons success-icon">check_circle</span>
                            ) : (
                              <span className="material-icons secondary-icon">cancel</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
        </div>
      </div>

      {/* Criteria Materials Modal */}
      {selectedCriteriaId && (
        <div className="modal-overlay modal-secondary" onClick={() => setSelectedCriteriaId(null)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Materiales del Criterio</h3>
                <p className="modal-subtitle">Criterio RowId: {selectedCriteriaId}</p>
              </div>
              <button onClick={() => setSelectedCriteriaId(null)} className="btn-close">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="modal-body">
              {loadingMaterials ? (
                <div className="loading">Cargando materiales...</div>
              ) : criteriaMaterials.length === 0 ? (
                <div className="no-data">No hay materiales asignados a este criterio</div>
              ) : (
                <>
                  <div className="materials-scorecard">
                    <div className="scorecard-icon">
                      <span className="material-icons">inventory_2</span>
                    </div>
                    <div className="scorecard-content">
                      <div className="scorecard-label">Total de Productos</div>
                      <div className="scorecard-value">{criteriaMaterials.length}</div>
                    </div>
                  </div>
                  <div className="materials-list-compact">
                    {criteriaMaterials.map((material) => {
                      console.log('Material:', material.codigoSap, 'Quantity:', material.quantity);
                      return (
                        <div key={material.codigoSap} className="material-item-compact">
                          <span className="material-icons material-item-icon">inventory_2</span>
                          <div className="material-item-content">
                            <div className="material-code">{material.codigoSap}</div>
                            <div className="material-description">{material.description}</div>
                          </div>
                          <div className="material-quantity">
                            <span className="quantity-value">{material.quantity || 0}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedCriteriaId(null)} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Materials Modal */}
      {selectedAssignmentId && (
        <div className="modal-overlay modal-secondary" onClick={() => setSelectedAssignmentId(null)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Materiales de la Asignación</h3>
                <p className="modal-subtitle">Asignación RowId: {selectedAssignmentId}</p>
              </div>
              <button onClick={() => setSelectedAssignmentId(null)} className="btn-close">
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="modal-body">
              {loadingAssignmentMaterials ? (
                <div className="loading">Cargando materiales...</div>
              ) : assignmentMaterials.length === 0 ? (
                <div className="no-data">No hay materiales asignados a esta asignación directa</div>
              ) : (
                <>
                  <div className="materials-scorecard">
                    <div className="scorecard-icon">
                      <span className="material-icons">inventory_2</span>
                    </div>
                    <div className="scorecard-content">
                      <div className="scorecard-label">Total de Productos</div>
                      <div className="scorecard-value">{assignmentMaterials.length}</div>
                    </div>
                  </div>
                  <div className="materials-list-compact">
                    {assignmentMaterials.map((material) => {
                      console.log('Assignment Material:', material.codigoSap, 'Quantity:', material.quantity);
                      return (
                        <div key={material.codigoSap} className="material-item-compact">
                          <span className="material-icons material-item-icon">inventory_2</span>
                          <div className="material-item-content">
                            <div className="material-code">{material.codigoSap}</div>
                            <div className="material-description">{material.description}</div>
                          </div>
                          <div className="material-quantity">
                            <span className="quantity-value">{material.quantity || 0}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedAssignmentId(null)} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
