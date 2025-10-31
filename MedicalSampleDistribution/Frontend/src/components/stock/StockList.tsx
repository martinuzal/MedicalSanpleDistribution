import { useState, useEffect } from 'react';
import type { Stock } from '../../types/stock';
import type { Import } from '../../types/import';
import { stockService } from '../../services/stockService';
import { importService } from '../../services/importService';
import { useNotifications } from '../../contexts/NotificationContext';
import './StockList.css';

interface StockListProps {
  onEditStockManual: (stock: Stock) => void;
  refreshKey: number;
}

export default function StockList({ onEditStockManual, refreshKey }: StockListProps) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(20);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [importFilter, setImportFilter] = useState<number | ''>('');

  const { addNotification } = useNotifications();

  useEffect(() => {
    loadImports();
  }, []);

  useEffect(() => {
    loadStocks();
  }, [currentPage, searchTerm, importFilter, refreshKey]);

  const loadImports = async () => {
    try {
      const response = await importService.getAll({ pageSize: 100 });
      setImports(response.imports);
    } catch (error) {
      console.error('Error loading imports:', error);
    }
  };

  const loadStocks = async () => {
    try {
      setLoading(true);
      const response = await stockService.getAll({
        search: searchTerm || undefined,
        importId: importFilter || undefined,
        pageNumber: currentPage,
        pageSize
      });

      setStocks(response.stocks);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setCurrentPage(response.currentPage);
    } catch (error) {
      addNotification('Error al cargar stocks', 'error');
      console.error('Error loading stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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

  const formatNumber = (value: number | null) => {
    if (value === null || value === undefined) return '-';
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
    return <div className="loading">Cargando stocks...</div>;
  }

  return (
    <div className="stock-list">
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
        Mostrando {stocks.length} de {totalItems} registros de stock
      </div>

      {/* Stock Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código SAP</th>
              <th>Descripción</th>
              <th>Marcación</th>
              <th>Estado</th>
              <th className="text-right">Stock</th>
              <th className="text-right">Stock Real</th>
              <th className="text-right">Stock Manual</th>
              <th className="text-right">Pack</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={9} className="no-data">
                  No se encontraron registros de stock
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.id}>
                  <td>
                    <strong>{stock.codigoSap}</strong>
                  </td>
                  <td>{stock.materialDescription}</td>
                  <td>
                    {stock.importDate ? formatDate(stock.importDate) : '-'}
                  </td>
                  <td>
                    {stock.importState && (
                      <span className={`badge ${getStateClass(stock.importState)}`}>
                        {stock.importState}
                      </span>
                    )}
                  </td>
                  <td className="text-right">{formatNumber(stock.stock)}</td>
                  <td className="text-right">{formatNumber(stock.stockReal)}</td>
                  <td className="text-right">
                    {stock.stockManual !== null && stock.stockManual !== undefined ? (
                      <span className="stock-manual-value">{formatNumber(stock.stockManual)}</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="text-right">{formatNumber(stock.pack)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEditStockManual(stock)}
                        className="btn-icon"
                        title="Editar stock manual"
                      >
                        <span className="material-icons">edit</span>
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
