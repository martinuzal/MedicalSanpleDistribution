import { useState } from 'react';
import DistributionList from '../../components/distribution/DistributionList';
import RepresentativeDetail from '../../components/distribution/RepresentativeDetail';
import './DistributionPage.css';

export default function DistributionPage() {
  const [selectedRepresentative, setSelectedRepresentative] = useState<{
    code: number;
    name: string;
  } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewRepresentative = (representativeCode: number, representativeName: string) => {
    setSelectedRepresentative({
      code: representativeCode,
      name: representativeName
    });
  };

  const handleCloseDetail = () => {
    setSelectedRepresentative(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>Resultados de Distribución</h1>
          <p className="page-subtitle">
            Visualización de distribución de materiales por representante
          </p>
        </div>
      </div>

      <DistributionList
        onViewRepresentative={handleViewRepresentative}
        refreshKey={refreshKey}
      />

      {selectedRepresentative && (
        <RepresentativeDetail
          representativeCode={selectedRepresentative.code}
          representativeName={selectedRepresentative.name}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}
