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

export default function ImportDetailModal({ importId, onClose }: ImportDetailModalProps) {
  const [detail, setDetail] = useState<ImportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('general');
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
                <div className="criteria-list">
                  {detail.criteria.map((criteria, index) => (
                    <div key={criteria.id} className="criteria-card">
                      <div className="criteria-header">
                        <h4>Criterio #{index + 1}</h4>
                        {criteria.porcenDeAplic && (
                          <span className="badge badge-info">{criteria.porcenDeAplic}% aplicación</span>
                        )}
                      </div>
                      <div className="criteria-grid">
                        <div className="criteria-item"><label>Tipo Cliente:</label>{renderValue(criteria.tipoCliente)}</div>
                        <div className="criteria-item"><label>Campaña:</label>{renderValue(criteria.campania)}</div>
                        <div className="criteria-item"><label>Lugar Visita:</label>{renderValue(criteria.lugarVisita)}</div>
                        <div className="criteria-item"><label>Institución:</label>{renderValue(criteria.institucion)}</div>
                        <div className="criteria-item"><label>Especialidad:</label>{renderValue(criteria.especialidad)}</div>
                        <div className="criteria-item"><label>Categoría:</label>{renderValue(criteria.categoria)}</div>
                        <div className="criteria-item"><label>Línea:</label>{renderValue(criteria.linea)}</div>
                        <div className="criteria-item"><label>Provincia:</label>{renderValue(criteria.provincia)}</div>
                        <div className="criteria-item"><label>Frecuencia:</label>{renderValue(criteria.frecuencia)}</div>
                        <div className="criteria-item"><label>Planificación:</label>{renderValue(criteria.planificacion)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="tab-content">
              {detail.directAssignments.length === 0 ? (
                <div className="no-data">No hay asignaciones directas</div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Supervisor</th>
                        <th>Legajo Supervisor</th>
                        <th>Representante</th>
                        <th>Legajo Representante</th>
                        <th>Excluido</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.directAssignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td>{renderValue(assignment.supervisor)}</td>
                          <td>{renderValue(assignment.legajoSupervisor)}</td>
                          <td><strong>{renderValue(assignment.representante)}</strong></td>
                          <td>{renderValue(assignment.legajoRepresentante)}</td>
                          <td>{renderValue(assignment.excluded)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
    </div>
  );
}
