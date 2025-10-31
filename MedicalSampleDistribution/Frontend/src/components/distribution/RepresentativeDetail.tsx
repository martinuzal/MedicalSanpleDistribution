import { useState, useEffect } from 'react';
import type { RepresentativeDistribution } from '../../types/distribution';
import { distributionService } from '../../services/distributionService';
import { useNotifications } from '../../contexts/NotificationContext';
import './RepresentativeDetail.css';

interface RepresentativeDetailProps {
  representativeCode: number;
  representativeName: string;
  onClose: () => void;
}

export default function RepresentativeDetail({ representativeCode, representativeName, onClose }: RepresentativeDetailProps) {
  const [distribution, setDistribution] = useState<RepresentativeDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadRepresentativeDistribution();
  }, [representativeCode]);

  const loadRepresentativeDistribution = async () => {
    try {
      setLoading(true);
      const data = await distributionService.getByRepresentative(representativeCode);
      setDistribution(data);
    } catch (error) {
      addNotification('Error al cargar distribución del representante', 'error');
      console.error('Error loading representative distribution:', error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Distribución del Representante</h2>
          <button onClick={onClose} className="btn-close">
            <span className="material-icons">close</span>
          </button>
        </div>

        {loading ? (
          <div className="modal-body">
            <div className="loading">Cargando distribución...</div>
          </div>
        ) : distribution ? (
          <>
            <div className="modal-body">
              {/* Representative Info */}
              <div className="detail-section">
                <h3>Información del Representante</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Código:</label>
                    <span className="detail-value strong">{distribution.representativeCode}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nombre:</label>
                    <span className="detail-value">{distribution.representativeName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Cantidad:</label>
                    <span className="detail-value strong total-quantity">{formatNumber(distribution.totalQuantity)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Materiales Asignados:</label>
                    <span className="detail-value">{distribution.materials.length}</span>
                  </div>
                </div>
              </div>

              {/* Materials Distribution */}
              <div className="detail-section">
                <h3>Materiales Distribuidos</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Código SAP</th>
                        <th>Descripción</th>
                        <th className="text-right">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {distribution.materials.map((material, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{material.materialId}</strong>
                          </td>
                          <td>{material.materialDescription}</td>
                          <td className="text-right">
                            <strong className="quantity-value">{formatNumber(material.quantity)}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="total-row">
                        <td colSpan={2} className="text-right">
                          <strong>Total:</strong>
                        </td>
                        <td className="text-right">
                          <strong className="total-quantity">{formatNumber(distribution.totalQuantity)}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={onClose} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </>
        ) : (
          <div className="modal-body">
            <div className="no-data">No se pudo cargar la información de distribución</div>
          </div>
        )}
      </div>
    </div>
  );
}
