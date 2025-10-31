import { useState } from 'react';
import StockList from '../../components/stock/StockList';
import EditStockManualForm from '../../components/stock/EditStockManualForm';
import type { Stock } from '../../types/stock';
import './StockPage.css';

export default function StockPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEditStockManual = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleCloseForm = () => {
    setSelectedStock(null);
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Gestión de Stock</h1>
          <p className="page-subtitle">
            Visualización y gestión de inventario disponible por marcación
          </p>
        </div>
      </div>

      <StockList
        onEditStockManual={handleEditStockManual}
        refreshKey={refreshKey}
      />

      {selectedStock && (
        <EditStockManualForm
          stock={selectedStock}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
