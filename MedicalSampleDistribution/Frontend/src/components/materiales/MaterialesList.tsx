import { useState, useEffect } from 'react';
import type { Material } from '../../types/material';
import { materialService } from '../../services/materialService';
import { useNotifications } from '../../contexts/NotificationContext';
import './MaterialesList.css';

interface MaterialesListProps {
  onViewDetail: (material: Material) => void;
  refreshKey: number;
}

export default function MaterialesList({ onViewDetail, refreshKey }: MaterialesListProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(20);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { addNotification } = useNotifications();

  useEffect(() => {
    loadMaterials();
  }, [currentPage, searchTerm, statusFilter, refreshKey]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialService.getAll({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        pageNumber: currentPage,
        pageSize
      });

      setMaterials(response.materials);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setCurrentPage(response.currentPage);
    } catch (error) {
      addNotification('Error al cargar materiales', 'error');
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
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

  if (loading) {
    return <div className="loading">Cargando materiales...</div>;
  }

  return (
    <div className="materiales-list">
      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Buscar por código SAP o descripción..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="select-input"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="results-info">
        Mostrando {materials.length} de {totalItems} materiales
      </div>

      {/* Materials Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código SAP</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Stock Actual</th>
              <th>Pack</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  No se encontraron materiales
                </td>
              </tr>
            ) : (
              materials.map((material) => (
                <tr key={material.id}>
                  <td>
                    <strong>{material.codigoSap}</strong>
                  </td>
                  <td>{material.description}</td>
                  <td>
                    <span className={`badge ${getStatusClass(material.status)}`}>
                      {material.status}
                    </span>
                  </td>
                  <td className="text-right">
                    {material.currentStock !== null && material.currentStock !== undefined
                      ? material.currentStock.toLocaleString()
                      : '-'}
                  </td>
                  <td className="text-right">
                    {material.pack || '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onViewDetail(material)}
                        className="btn-icon"
                        title="Ver detalle"
                      >
                        <span className="material-icons">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-secondary"
          >
            <span className="material-icons">chevron_left</span>
            Anterior
          </button>

          <span className="page-info">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-secondary"
          >
            Siguiente
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
