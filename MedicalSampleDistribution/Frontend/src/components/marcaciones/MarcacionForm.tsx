import { useState, useEffect } from 'react';
import { importService } from '../../services/importService';
import type { Import, CreateImportDto, UpdateImportDto } from '../../types/import';
import { useNotifications } from '../../contexts/NotificationContext';
import './MarcacionForm.css';

interface MarcacionFormProps {
  marcacion?: Import;
  onSuccess: () => void;
  onCancel: () => void;
}

const MarcacionForm = ({ marcacion, onSuccess, onCancel }: MarcacionFormProps) => {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: 1, // TODO: Obtener del contexto de usuario
    importDate: '',
    state: 'Draft',
    fileNameExistencia: '',
    fileNameAsignacion: '',
    fileBase: '',
  });

  useEffect(() => {
    if (marcacion) {
      setFormData({
        userId: marcacion.userId,
        importDate: marcacion.importDate.split('T')[0],
        state: marcacion.state || 'Draft',
        fileNameExistencia: marcacion.fileNameExistencia || '',
        fileNameAsignacion: marcacion.fileNameAsignacion || '',
        fileBase: marcacion.fileBase || '',
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, importDate: today }));
    }
  }, [marcacion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (marcacion) {
        // Update
        const updateDto: UpdateImportDto = {
          state: formData.state,
          fileNameExistencia: formData.fileNameExistencia,
          fileNameAsignacion: formData.fileNameAsignacion,
          fileBase: formData.fileBase,
          usuarioModificacion: 'admin', // TODO: Obtener usuario actual
        };

        await importService.update(marcacion.id, updateDto);

        addNotification({
          title: 'Éxito',
          message: 'Marcación actualizada correctamente',
          type: 'success',
          category: 'marcaciones',
        });
      } else {
        // Create
        const createDto: CreateImportDto = {
          ...formData,
          importDate: new Date(formData.importDate).toISOString(),
          usuarioAlta: 'admin', // TODO: Obtener usuario actual
        };

        await importService.create(createDto);

        addNotification({
          title: 'Éxito',
          message: 'Marcación creada correctamente',
          type: 'success',
          category: 'marcaciones',
        });
      }

      onSuccess();
    } catch (error: any) {
      addNotification({
        title: 'Error',
        message: error.response?.data || 'Error al guardar marcación',
        type: 'error',
        category: 'marcaciones',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{marcacion ? 'Editar' : 'Nueva'} Marcación</h2>
          <button className="btn-icon" onClick={onCancel} title="Cerrar">
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Fecha de Importación <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="importDate"
                  value={formData.importDate}
                  onChange={handleChange}
                  required
                  disabled={!!marcacion}
                />
              </div>

              <div className="form-group">
                <label>
                  Estado <span className="required">*</span>
                </label>
                <select name="state" value={formData.state} onChange={handleChange} required>
                  <option value="Draft">Borrador</option>
                  <option value="InProgress">En Progreso</option>
                  <option value="Completed">Completado</option>
                  <option value="Cancelled">Cancelado</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Archivo de Existencia</label>
                <input
                  type="text"
                  name="fileNameExistencia"
                  value={formData.fileNameExistencia}
                  onChange={handleChange}
                  placeholder="Nombre del archivo de existencias"
                />
              </div>

              <div className="form-group full-width">
                <label>Archivo de Asignación</label>
                <input
                  type="text"
                  name="fileNameAsignacion"
                  value={formData.fileNameAsignacion}
                  onChange={handleChange}
                  placeholder="Nombre del archivo de asignaciones"
                />
              </div>

              <div className="form-group full-width">
                <label>Archivo Base</label>
                <textarea
                  name="fileBase"
                  value={formData.fileBase}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Información adicional del archivo base"
                />
              </div>
            </div>

            {marcacion && (
              <div className="info-section">
                <h4>Información de Auditoría</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Creado por:</span>
                    <span className="info-value">{marcacion.usuarioAlta}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de creación:</span>
                    <span className="info-value">
                      {new Date(marcacion.fechaAlta).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Modificado por:</span>
                    <span className="info-value">{marcacion.usuarioModificacion}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de modificación:</span>
                    <span className="info-value">
                      {new Date(marcacion.fechaModificacion).toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : marcacion ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarcacionForm;
