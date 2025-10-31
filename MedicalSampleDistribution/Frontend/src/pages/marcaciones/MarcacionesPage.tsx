import { useState } from 'react';
import MarcacionesList from '../../components/marcaciones/MarcacionesList';
import MarcacionForm from '../../components/marcaciones/MarcacionForm';
import ImportDetailModal from '../../components/marcaciones/ImportDetailModal';
import type { Import } from '../../types/import';
import './MarcacionesPage.css';

const MarcacionesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMarcacion, setSelectedMarcacion] = useState<Import | undefined>(undefined);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNew = () => {
    setSelectedMarcacion(undefined);
    setShowForm(true);
  };

  const handleEdit = (marcacion: Import) => {
    setSelectedMarcacion(marcacion);
    setShowForm(true);
  };

  const handleViewDetail = (marcacion: Import) => {
    setSelectedDetailId(marcacion.id);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedDetailId(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedMarcacion(undefined);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedMarcacion(undefined);
  };

  const handleDelete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="marcaciones-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Marcaciones</h1>
          <p className="page-description">
            Administra las planificaciones de entrega de muestras médicas
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleNew}>
          <span className="material-icons">add</span>
          Nueva Marcación
        </button>
      </div>

      <div className="page-content">
        <MarcacionesList
          key={refreshKey}
          onEdit={handleEdit}
          onViewDetail={handleViewDetail}
          onDelete={handleDelete}
          refreshKey={refreshKey}
        />
      </div>

      {showForm && (
        <MarcacionForm
          marcacion={selectedMarcacion}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      {showDetailModal && selectedDetailId && (
        <ImportDetailModal
          importId={selectedDetailId}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
};

export default MarcacionesPage;
