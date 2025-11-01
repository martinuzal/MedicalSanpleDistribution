import { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import './DirectAssignmentForm.css';

interface MasterDataItem {
  code: string;
  description: string;
}

interface Material {
  codigoSap: string;
  description: string;
  pack: number;
}

interface ProductQuantity {
  codigoSap: string;
  quantity: number;
}

interface DirectAssignmentFormProps {
  importId: number;
  rowId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DirectAssignmentForm({ importId, rowId, onClose, onSuccess }: DirectAssignmentFormProps) {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [loadingMasterData, setLoadingMasterData] = useState(true);

  // Master data states
  const [supervisors, setSupervisors] = useState<MasterDataItem[]>([]);
  const [representatives, setRepresentatives] = useState<MasterDataItem[]>([]);

  // Materials state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    supervisor: '',
    legajoSupervisor: '',
    representante: '',
    legajoRepresentante: '',
    excluded: '',
  });

  useEffect(() => {
    loadMasterData();
    loadMaterials();
    if (rowId) {
      loadDirectAssignmentData();
    }
  }, [rowId]);

  const loadMaterials = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/catalogs/materials-stock?importId=${importId}`);
      if (!response.ok) throw new Error('Error loading materials');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error loading materials:', error);
      addNotification('Error al cargar materiales', 'error');
    }
  };

  const loadMasterData = async () => {
    try {
      setLoadingMasterData(true);

      const [supervisorsRes, representativesRes] = await Promise.all([
        fetch('http://localhost:5001/api/masterdata/supervisors'),
        fetch('http://localhost:5001/api/masterdata/representatives'),
      ]);

      if (!supervisorsRes.ok || !representativesRes.ok) {
        throw new Error('Error loading master data');
      }

      const [supervisorsData, representativesData] = await Promise.all([
        supervisorsRes.json(),
        representativesRes.json(),
      ]);

      setSupervisors(supervisorsData);
      setRepresentatives(representativesData);
    } catch (error) {
      console.error('Error loading master data:', error);
      addNotification('Error al cargar datos maestros', 'error');
    } finally {
      setLoadingMasterData(false);
    }
  };

  const loadDirectAssignmentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/imports/${importId}/direct-assignment/${rowId}`);
      if (!response.ok) throw new Error('Error loading direct assignment');

      const data = await response.json();

      // Set form data
      setFormData({
        supervisor: data.supervisor || '',
        legajoSupervisor: data.legajoSupervisor || '',
        representante: data.representante || '',
        legajoRepresentante: data.legajoRepresentante || '',
        excluded: data.excluded || '',
      });

      // Set selected products
      if (data.products && data.products.length > 0) {
        const productsMap = new Map();
        data.products.forEach((p: ProductQuantity) => {
          productsMap.set(p.codigoSap, p.quantity);
        });
        setSelectedProducts(productsMap);
      }
    } catch (error) {
      console.error('Error loading direct assignment:', error);
      addNotification('Error al cargar asignación directa', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRepresentativeChange = async (representativeCode: string) => {
    setFormData(prev => ({ ...prev, representante: representativeCode }));

    if (representativeCode) {
      try {
        const response = await fetch(`http://localhost:5001/api/masterdata/hierarchy-legacy-code/${representativeCode}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, legajoRepresentante: data.legacyCode || '' }));
        }
      } catch (error) {
        console.error('Error loading legacy code:', error);
      }
    } else {
      setFormData(prev => ({ ...prev, legajoRepresentante: '' }));
    }
  };

  const handleSupervisorChange = (supervisorCode: string) => {
    setFormData(prev => ({ ...prev, supervisor: supervisorCode }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = (product: Material) => {
    setSelectedProducts(prev => {
      const newMap = new Map(prev);
      newMap.set(product.codigoSap, product.pack);
      return newMap;
    });
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleRemoveProduct = (codigoSap: string) => {
    setSelectedProducts(prev => {
      const newMap = new Map(prev);
      newMap.delete(codigoSap);
      return newMap;
    });
  };

  const handleProductQuantityChange = (codigoSap: string, quantity: number) => {
    setSelectedProducts(prev => {
      const newMap = new Map(prev);
      newMap.set(codigoSap, quantity);
      return newMap;
    });
  };

  const filteredMaterials = materials.filter(m => {
    if (!searchTerm) return false;
    const search = searchTerm.toLowerCase();
    return (
      m.codigoSap.toLowerCase().includes(search) ||
      m.description.toLowerCase().includes(search)
    ) && !selectedProducts.has(m.codigoSap);
  });

  const handleSubmit = async () => {
    // Validar que solo se haya seleccionado Supervisor O Representante
    const hasSupervisor = formData.supervisor.trim() !== '';
    const hasRepresentante = formData.representante.trim() !== '';

    if (!hasSupervisor && !hasRepresentante) {
      addNotification('Debe seleccionar un Supervisor o un Representante', 'error');
      return;
    }

    if (hasSupervisor && hasRepresentante) {
      addNotification('Solo puede seleccionar Supervisor O Representante, no ambos', 'error');
      return;
    }

    // Validar que haya al menos un material
    if (selectedProducts.size === 0) {
      addNotification('Debe seleccionar al menos un material', 'error');
      return;
    }

    try {
      setLoading(true);

      const products = Array.from(selectedProducts.entries()).map(([codigoSap, quantity]) => ({
        codigoSap,
        quantity,
      }));

      const payload = {
        supervisor: formData.supervisor || null,
        legajoSupervisor: formData.legajoSupervisor || null,
        representante: formData.representante || null,
        legajoRepresentante: formData.legajoRepresentante || null,
        excluded: formData.excluded || null,
        usuarioAlta: 'System',
        products,
      };

      const url = rowId
        ? `http://localhost:5001/api/imports/${importId}/direct-assignment/${rowId}`
        : `http://localhost:5001/api/imports/${importId}/direct-assignment`;

      const method = rowId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || (rowId ? 'Error al actualizar asignación directa' : 'Error al crear asignación directa'));
      }

      addNotification(rowId ? 'Asignación directa actualizada exitosamente' : 'Asignación directa creada exitosamente', 'success');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating direct assignment:', error);
      addNotification(error.message || 'Error al crear asignación directa', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingMasterData) {
    return (
      <div className="direct-assignment-overlay">
        <div className="direct-assignment-modal">
          <div className="loading">Cargando formulario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="direct-assignment-overlay">
      <div className="direct-assignment-modal">
        <div className="direct-assignment-header">
          <h2>{rowId ? 'Editar Asignación Directa' : 'Nueva Asignación Directa'}</h2>
          <button onClick={onClose} className="btn-close">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="direct-assignment-body">
          <div className="form-layout">
            {/* Form Fields Section */}
            <div className="form-fields-section">
              <div className="form-section">
                <h3 className="section-title">
                  <span className="material-icons">person</span>
                  Asignación
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <span className="material-icons">supervisor_account</span>
                      Supervisor
                    </label>
                    <select
                      value={formData.supervisor}
                      onChange={(e) => {
                        handleSupervisorChange(e.target.value);
                        if (e.target.value) {
                          setFormData(prev => ({ ...prev, representante: '', legajoRepresentante: '' }));
                        }
                      }}
                      disabled={formData.representante !== ''}
                    >
                      <option value="">Seleccionar...</option>
                      {supervisors.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Legajo Supervisor</label>
                    <input
                      type="text"
                      value={formData.legajoSupervisor}
                      onChange={(e) => handleInputChange('legajoSupervisor', e.target.value)}
                      placeholder="Ingrese legajo"
                      disabled={formData.supervisor === ''}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <span className="material-icons">person</span>
                      Representante
                    </label>
                    <select
                      value={formData.representante}
                      onChange={(e) => {
                        handleRepresentativeChange(e.target.value);
                        if (e.target.value) {
                          setFormData(prev => ({ ...prev, supervisor: '', legajoSupervisor: '' }));
                        }
                      }}
                      disabled={formData.supervisor !== ''}
                    >
                      <option value="">Seleccionar...</option>
                      {representatives.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Legajo Representante</label>
                    <input
                      type="text"
                      value={formData.legajoRepresentante}
                      onChange={(e) => handleInputChange('legajoRepresentante', e.target.value)}
                      placeholder="Auto-completa"
                      disabled={true}
                    />
                  </div>

                  <div className="form-group form-group-full-width">
                    <label>Excluido</label>
                    <input
                      type="text"
                      value={formData.excluded}
                      onChange={(e) => handleInputChange('excluded', e.target.value)}
                      placeholder="Ingrese valor de exclusión"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Sidebar */}
            <div className="products-sidebar">
              <div className="products-header">
                <h3 className="section-title">
                  <span className="material-icons">inventory_2</span>
                  Materiales
                </h3>
              </div>

              <div className="products-search">
                <div className="search-input-wrapper">
                  <span className="material-icons">search</span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar material..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                  />
                </div>

                {showSearchResults && searchTerm && (
                  <div className="search-results">
                    {filteredMaterials.length > 0 ? (
                      filteredMaterials.slice(0, 10).map((material) => (
                        <div
                          key={material.codigoSap}
                          className="search-result-item"
                          onClick={() => handleAddProduct(material)}
                        >
                          <div className="search-result-code">{material.codigoSap}</div>
                          <div className="search-result-description">{material.description}</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-search-results">No se encontraron materiales</div>
                    )}
                  </div>
                )}
              </div>

              <div className="selected-products-section">
                <div className="selected-products-title">
                  Materiales Seleccionados ({selectedProducts.size})
                </div>

                {selectedProducts.size === 0 ? (
                  <div className="no-products-selected">
                    <span className="material-icons">inventory</span>
                    <p>No hay materiales seleccionados</p>
                  </div>
                ) : (
                  Array.from(selectedProducts.entries()).map(([codigoSap, quantity]) => {
                    const material = materials.find(m => m.codigoSap === codigoSap);
                    return (
                      <div key={codigoSap} className="selected-product-item">
                        <div className="selected-product-header">
                          <div className="selected-product-info">
                            <div className="selected-product-code">{codigoSap}</div>
                            <div className="selected-product-description">
                              {material?.description}
                            </div>
                          </div>
                          <button
                            className="btn-remove-product"
                            onClick={() => handleRemoveProduct(codigoSap)}
                            type="button"
                          >
                            <span className="material-icons">close</span>
                          </button>
                        </div>
                        <div className="selected-product-quantity">
                          <label>Cantidad:</label>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleProductQuantityChange(codigoSap, parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="direct-assignment-footer">
          <button onClick={onClose} className="btn btn-secondary" disabled={loading}>
            Cancelar
          </button>
          <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Asignación'}
          </button>
        </div>
      </div>
    </div>
  );
}
