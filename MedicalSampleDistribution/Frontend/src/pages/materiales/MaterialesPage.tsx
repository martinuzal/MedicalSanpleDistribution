import { useState } from 'react';
import MaterialesList from '../../components/materiales/MaterialesList';
import MaterialDetail from '../../components/materiales/MaterialDetail';
import type { Material } from '../../types/material';
import './MaterialesPage.css';

export default function MaterialesPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewDetail = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleCloseDetail = () => {
    setSelectedMaterial(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Maestro de Materiales</h1>
          <p className="page-subtitle">
            Consulta de materiales y muestras médicas disponibles
          </p>
        </div>
      </div>

      <MaterialesList
        onViewDetail={handleViewDetail}
        refreshKey={refreshKey}
      />

      {selectedMaterial && (
        <MaterialDetail
          materialId={selectedMaterial.id}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
