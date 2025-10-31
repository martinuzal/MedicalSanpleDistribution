import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { importService } from '../../services/importService';
import type { Import } from '../../types/import';
import { useNotifications } from '../../contexts/NotificationContext';
import './MarcacionesList.css';

interface MarcacionesListProps {
  onEdit: (marcacion: Import) => void;
  onViewDetail: (marcacion: Import) => void;
  onDelete: () => void;
  refreshKey: number;
}

const MarcacionesList = ({ onEdit, onViewDetail, onDelete, refreshKey }: MarcacionesListProps) => {
  const navigate = useNavigate();
  const [marcaciones, setMarcaciones] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    state: '',
    fromDate: '',
    toDate: '',
    hasDistribution: undefined as boolean | undefined,
    pageNumber: 1,
    pageSize: 20,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadMarcaciones();
  }, [filters, refreshKey]);

  const loadMarcaciones = async () => {
    try {
      setLoading(true);
      const response = await importService.getAll(filters);
      setMarcaciones(response.imports);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error: any) {
      addNotification({
        title: 'Error',
        message: error.response?.data || 'Error al cargar marcaciones',
        type: 'error',
        category: 'marcaciones',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar esta marcación?')) return;

    try {
      await importService.delete(id, 'admin'); // TODO: Obtener usuario actual
      addNotification({
        title: 'Éxito',
        message: 'Marcación eliminada correctamente',
        type: 'success',
        category: 'marcaciones',
      });
      onDelete();
      loadMarcaciones();
    } catch (error: any) {
      addNotification({
        title: 'Error',
        message: error.response?.data || 'Error al eliminar marcación',
        type: 'error',
        category: 'marcaciones',
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStateBadge = (state?: string) => {
    const stateMap: { [key: string]: { label: string; className: string } } = {
      Draft: { label: 'Borrador', className: 'badge-warning' },
      InProgress: { label: 'En Progreso', className: 'badge-info' },
      Completed: { label: 'Completado', className: 'badge-success' },
      Cancelled: { label: 'Cancelado', className: 'badge-error' },
    };

    const stateInfo = stateMap[state || 'Draft'] || { label: state || 'N/A', className: 'badge-info' };
    return <span className={`badge ${stateInfo.className}`}>{stateInfo.label}</span>;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando marcaciones...</p>
      </div>
    );
  }

  return (
    <div className="marcaciones-list-container">
      <div className="filters-section">
        <div className="filters-toolbar">
          <div className="filter-item">
            <span className="material-icons filter-icon">label</span>
            <select
              className="filter-select"
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value, pageNumber: 1 })}
            >
              <option value="">Todos los estados</option>
              <option value="Draft">Borrador</option>
              <option value="InProgress">En Progreso</option>
              <option value="Completed">Completado</option>
              <option value="Cancelled">Cancelado</option>
            </select>
          </div>

          <div className="filter-divider"></div>

          <div className="filter-item">
            <span className="material-icons filter-icon">calendar_today</span>
            <input
              type="date"
              className="filter-input"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value, pageNumber: 1 })}
              placeholder="Desde"
            />
          </div>

          <div className="filter-item">
            <span className="material-icons filter-icon">event</span>
            <input
              type="date"
              className="filter-input"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value, pageNumber: 1 })}
              placeholder="Hasta"
            />
          </div>

          <div className="filter-divider"></div>

          <div className="filter-item filter-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.hasDistribution === true}
                onChange={(e) => setFilters({ ...filters, hasDistribution: e.target.checked ? true : undefined, pageNumber: 1 })}
              />
              <span className="material-icons checkbox-icon">
                {filters.hasDistribution ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span>Con distribución</span>
            </label>
          </div>

          <div className="filter-spacer"></div>

          <div className="results-info">
            <span className="material-icons">info</span>
            <span>{marcaciones.length} / {totalItems}</span>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha Importación</th>
                <th>Estado</th>
                <th>Usuario</th>
                <th>Archivo Existencia</th>
                <th>Archivo Asignación</th>
                <th>Fecha Alta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {marcaciones.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    No hay marcaciones para mostrar
                  </td>
                </tr>
              ) : (
                marcaciones.map((marcacion) => (
                  <tr key={marcacion.id}>
                    <td>{marcacion.id}</td>
                    <td>{formatDate(marcacion.importDate)}</td>
                    <td>{getStateBadge(marcacion.state)}</td>
                    <td>{marcacion.userName || 'N/A'}</td>
                    <td className="file-cell">{marcacion.fileNameExistencia || '-'}</td>
                    <td className="file-cell">{marcacion.fileNameAsignacion || '-'}</td>
                    <td>{formatDate(marcacion.fechaAlta)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/marcaciones/${marcacion.id}/dashboard`)}
                          title="Dashboard de Cobertura"
                        >
                          <span className="material-icons">dashboard</span>
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/marcaciones/${marcacion.id}/general-distribution`)}
                          title="Dashboard de Distribución General"
                        >
                          <span className="material-icons">view_list</span>
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => onViewDetail(marcacion)}
                          title="Ver detalle"
                        >
                          <span className="material-icons">visibility</span>
                        </button>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => onEdit(marcacion)}
                          title="Editar"
                        >
                          <span className="material-icons">edit</span>
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDelete(marcacion.id)}
                          title="Eliminar"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={filters.pageNumber === 1}
            onClick={() => handlePageChange(filters.pageNumber - 1)}
          >
            <span className="material-icons">chevron_left</span>
            Anterior
          </button>

          <div className="pagination-info">
            Página {filters.pageNumber} de {totalPages}
          </div>

          <button
            className="btn btn-secondary"
            disabled={filters.pageNumber === totalPages}
            onClick={() => handlePageChange(filters.pageNumber + 1)}
          >
            Siguiente
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MarcacionesList;
