import { useState, useEffect } from 'react';
import type { Distribution } from '../../types/distribution';
import type { Import } from '../../types/import';
import { distributionService } from '../../services/distributionService';
import { importService } from '../../services/importService';
import { useNotifications } from '../../contexts/NotificationContext';
import './DistributionList.css';

interface DistributionListProps {
  onViewRepresentative: (representativeCode: number, representativeName: string) => void;
  refreshKey: number;
}

export default function DistributionList({ onViewRepresentative, refreshKey }: DistributionListProps) {
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(20);

  // Filters
  const [importFilter, setImportFilter] = useState<number | ''>('');

  const { addNotification } = useNotifications();

  useEffect(() => {
    loadImports();
  }, []);

  useEffect(() => {
    loadDistributions();
  }, [currentPage, importFilter, refreshKey]);

  const loadImports = async () => {
    try {
      const response = await importService.getAll({ pageSize: 100 });
      setImports(response.imports);
    } catch (error) {
      console.error('Error loading imports:', error);
    }
  };

  const loadDistributions = async () => {
    try {
      setLoading(true);
      const response = await distributionService.getAll({
        importId: importFilter || undefined,
        pageNumber: currentPage,
        pageSize
      });

      setDistributions(response.distributions);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setCurrentPage(response.currentPage);
    } catch (error) {
      addNotification('Error al cargar distribuciones', 'error');
      console.error('Error loading distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportFilter = (value: string) => {
    setImportFilter(value ? parseInt(value) : '');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const getStateClass = (state: string | null) => {
    switch (state?.toLowerCase()) {
      case 'completado':
        return 'badge-success';
      case 'en progreso':
        return 'badge-info';
      case 'borrador':
        return 'badge-secondary';
      case 'cancelado':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading) {
    return <div className="loading">Cargando distribuciones...</div>;
  }

  return (
    <div className="distribution-list">
      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <span className="material-icons">filter_list</span>
          <select
            value={importFilter}
            onChange={(e) => handleImportFilter(e.target.value)}
            className="select-input"
          >
            <option value="">Todas las marcaciones</option>
            {imports.map((imp) => (
              <option key={imp.id} value={imp.id}>
                {formatDate(imp.importDate)} - {imp.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results info */}
      <div className="results-info">
        Mostrando {distributions.length} de {totalItems} distribuciones
      </div>

      {/* Distribution Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Representante</th>
              <th>Supervisor</th>
              <th>Material</th>
              <th>Marcación</th>
              <th>Estado</th>
              <th className="text-right">Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {distributions.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  No se encontraron distribuciones
                </td>
              </tr>
            ) : (
              distributions.map((dist) => (
                <tr key={dist.id}>
                  <td>
                    <strong>{dist.representativeName}</strong>
                    <br />
                    <small className="text-muted">Código: {dist.representativeCode}</small>
                  </td>
                  <td>
                    {dist.supervisorName}
                    <br />
                    <small className="text-muted">Código: {dist.supervisorCode}</small>
                  </td>
                  <td>
                    <strong>{dist.materialId}</strong>
                    <br />
                    <small>{dist.materialDescription}</small>
                  </td>
                  <td>
                    {dist.importDate ? formatDate(dist.importDate) : '-'}
                  </td>
                  <td>
                    {dist.importState && (
                      <span className={`badge ${getStateClass(dist.importState)}`}>
                        {dist.importState}
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <strong className="quantity-value">{formatNumber(dist.cant)}</strong>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onViewRepresentative(dist.representativeCode, dist.representativeName)}
                        className="btn-icon"
                        title="Ver detalle del representante"
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
