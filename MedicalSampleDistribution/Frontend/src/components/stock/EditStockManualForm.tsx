import { useState, useEffect } from 'react';
import type { Stock } from '../../types/stock';
import { stockService } from '../../services/stockService';
import { useNotifications } from '../../contexts/NotificationContext';
import './EditStockManualForm.css';

interface EditStockManualFormProps {
  stock: Stock;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditStockManualForm({ stock, onClose, onSuccess }: EditStockManualFormProps) {
  const [stockManual, setStockManual] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (stock.stockManual !== null && stock.stockManual !== undefined) {
      setStockManual(stock.stockManual);
    }
  }, [stock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await stockService.updateStockManual(stock.id, {
        stockManual: stockManual === '' ? null : Number(stockManual)
      });

      addNotification('Stock manual actualizado correctamente', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      addNotification('Error al actualizar stock manual', 'error');
      console.error('Error updating stock manual:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatNumber = (value: number | null) => {
    if (value === null || value === undefined) return '-';
    return value.toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Stock Manual</h2>
          <button onClick={onClose} className="btn-close">
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Material Info */}
            <div className="info-section">
              <div className="info-row">
                <label>Código SAP:</label>
                <span className="info-value">{stock.codigoSap}</span>
              </div>
              <div className="info-row">
                <label>Descripción:</label>
                <span className="info-value">{stock.materialDescription}</span>
              </div>
              <div className="info-row">
                <label>Stock:</label>
                <span className="info-value">{formatNumber(stock.stock)}</span>
              </div>
              <div className="info-row">
                <label>Stock Real:</label>
                <span className="info-value">{formatNumber(stock.stockReal)}</span>
              </div>
              <div className="info-row">
                <label>Pack:</label>
                <span className="info-value">{formatNumber(stock.pack)}</span>
              </div>
            </div>

            {/* Edit Stock Manual */}
            <div className="form-group">
              <label htmlFor="stockManual">
                Stock Manual: <span className="optional">(opcional)</span>
              </label>
              <input
                id="stockManual"
                type="number"
                value={stockManual}
                onChange={(e) => setStockManual(e.target.value === '' ? '' : parseInt(e.target.value))}
                placeholder="Ingrese stock manual"
                min="0"
                className="form-input"
              />
              <small className="form-help">
                Ingrese un valor para sobrescribir el stock automático. Deje vacío para usar el stock calculado.
              </small>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
