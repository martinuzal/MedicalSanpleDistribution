import { useState, useEffect } from 'react';
import type { MaterialDetail } from '../../types/material';
import { materialService } from '../../services/materialService';
import { useNotifications } from '../../contexts/NotificationContext';
import './MaterialDetail.css';

interface MaterialDetailProps {
  materialId: number;
  onClose: () => void;
}

export default function MaterialDetailComponent({ materialId, onClose }: MaterialDetailProps) {
  const [material, setMaterial] = useState<MaterialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadMaterialDetail();
  }, [materialId]);

  const loadMaterialDetail = async () => {
    try {
      setLoading(true);
      const data = await materialService.getById(materialId);
      setMaterial(data);
    } catch (error) {
      addNotification('Error al cargar detalle del material', 'error');
      console.error('Error loading material detail:', error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'activo':
        return 'badge-success';
      case 'inactivo':
        return 'badge-danger';
      case 'pendiente':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Detalle del Material</h2>
          <button onClick={onClose} className="btn-close">
            <span className="material-icons">close</span>
          </button>
        </div>

        {loading ? (
          <div className="modal-body">
            <div className="loading">Cargando detalle...</div>
          </div>
        ) : material ? (
          <>
            <div className="modal-body">
              {/* Material Information */}
              <div className="detail-section">
                <h3>Información General</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Código SAP:</label>
                    <span className="detail-value strong">{material.codigoSap}</span>
                  </div>
                  <div className="detail-item">
                    <label>Estado:</label>
                    <span className={`badge ${getStatusClass(material.status)}`}>
                      {material.status}
                    </span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Descripción:</label>
                    <span className="detail-value">{material.description}</span>
                  </div>
                </div>
              </div>

              {/* Stock by Import */}
              {material.stockByImport && material.stockByImport.length > 0 && (
                <div className="detail-section">
                  <h3>Stock por Marcación</h3>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID Marcación</th>
                          <th className="text-right">Stock</th>
                          <th className="text-right">Stock Real</th>
                          <th className="text-right">Stock Manual</th>
                          <th className="text-right">Pack</th>
                          <th className="text-right">Stock Mínimo</th>
                          <th className="text-right">Stock Máximo</th>
                          <th className="text-center">Usar Stock Real</th>
                        </tr>
                      </thead>
                      <tbody>
                        {material.stockByImport.map((stockInfo) => (
                          <tr key={stockInfo.importId}>
                            <td>{stockInfo.importId}</td>
                            <td className="text-right">{formatNumber(stockInfo.stock)}</td>
                            <td className="text-right">{formatNumber(stockInfo.stockReal)}</td>
                            <td className="text-right">{formatNumber(stockInfo.stockManual)}</td>
                            <td className="text-right">{formatNumber(stockInfo.pack)}</td>
                            <td className="text-right">{formatNumber(stockInfo.minStock)}</td>
                            <td className="text-right">{formatNumber(stockInfo.maxStock)}</td>
                            <td className="text-center">
                              {stockInfo.useStockReal ? (
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
                </div>
              )}

              {(!material.stockByImport || material.stockByImport.length === 0) && (
                <div className="detail-section">
                  <h3>Stock por Marcación</h3>
                  <p className="no-data">No hay información de stock disponible</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={onClose} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </>
        ) : (
          <div className="modal-body">
            <div className="no-data">No se pudo cargar la información del material</div>
          </div>
        )}
      </div>
    </div>
  );
}
