import { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import './CriteriaForm.css';

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

interface CriteriaFormProps {
  importId: number;
  criteriaId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CriteriaForm({ importId, criteriaId, onClose, onSuccess }: CriteriaFormProps) {
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [loadingMasterData, setLoadingMasterData] = useState(true);
  const isEditMode = criteriaId != null && criteriaId !== undefined;

  // Master data states
  const [specialties, setSpecialties] = useState<MasterDataItem[]>([]);
  const [customerTypes, setCustomerTypes] = useState<MasterDataItem[]>([]);
  const [institutionTypes, setInstitutionTypes] = useState<MasterDataItem[]>([]);
  const [categories, setCategories] = useState<MasterDataItem[]>([]);
  const [states, setStates] = useState<MasterDataItem[]>([]);
  const [lines, setLines] = useState<MasterDataItem[]>([]);
  const [auditMarkets, setAuditMarkets] = useState<MasterDataItem[]>([]);
  const [auditProducts, setAuditProducts] = useState<MasterDataItem[]>([]);
  const [auditMolecules, setAuditMolecules] = useState<MasterDataItem[]>([]);

  // Materials state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    tipoCliente: '',
    campania: '',
    lugarVisita: '',
    institucion: '',
    especialidad: '',
    edad: '',
    sexo: '',
    especialidadSec: '',
    especialidadCartera: '',
    categoria: '',
    tarea: '',
    frecuencia: '',
    planificacion: '',
    provincia: '',
    tratamiento: '',
    objetosEntregados: '',
    linea: '',
    auditCategoria: '',
    auditMercado: '',
    auditProducto: '',
    auditMolecula: '',
    porcenDeAplic: '',
  });

  useEffect(() => {
    loadMasterData();
    loadMaterials();
    if (isEditMode && criteriaId) {
      loadCriteria();
    }
  }, []);

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

      const [
        specialtiesRes,
        customerTypesRes,
        institutionTypesRes,
        categoriesRes,
        statesRes,
        linesRes,
        auditMarketsRes,
        auditProductsRes,
        auditMoleculesRes,
      ] = await Promise.all([
        fetch('http://localhost:5001/api/masterdata/specialties'),
        fetch('http://localhost:5001/api/masterdata/customer-types'),
        fetch('http://localhost:5001/api/masterdata/institution-types'),
        fetch('http://localhost:5001/api/masterdata/categories'),
        fetch('http://localhost:5001/api/masterdata/states'),
        fetch('http://localhost:5001/api/masterdata/lines'),
        fetch('http://localhost:5001/api/masterdata/audit-markets'),
        fetch('http://localhost:5001/api/masterdata/audit-products'),
        fetch('http://localhost:5001/api/masterdata/audit-molecules'),
      ]);

      setSpecialties(await specialtiesRes.json());
      setCustomerTypes(await customerTypesRes.json());
      setInstitutionTypes(await institutionTypesRes.json());
      setCategories(await categoriesRes.json());
      setStates(await statesRes.json());
      setLines(await linesRes.json());
      setAuditMarkets(await auditMarketsRes.json());
      setAuditProducts(await auditProductsRes.json());
      setAuditMolecules(await auditMoleculesRes.json());
    } catch (error) {
      addNotification('Error al cargar datos maestros', 'error');
      console.error('Error loading master data:', error);
    } finally {
      setLoadingMasterData(false);
    }
  };

  const loadCriteria = async () => {
    try {
      setLoadingMasterData(true);
      const response = await fetch(`http://localhost:5001/api/imports/${importId}/criteria/${criteriaId}`);
      if (!response.ok) throw new Error('Error loading criteria');

      const data = await response.json();

      // Cargar los datos del formulario
      setFormData({
        tipoCliente: data.criteria.tipoCliente || '',
        campania: data.criteria.campania || '',
        lugarVisita: data.criteria.lugarVisita || '',
        institucion: data.criteria.institucion || '',
        especialidad: data.criteria.especialidad || '',
        edad: data.criteria.edad || '',
        sexo: data.criteria.sexo || '',
        especialidadSec: data.criteria.especialidadSec || '',
        especialidadCartera: data.criteria.especialidadCartera || '',
        categoria: data.criteria.categoria || '',
        tarea: data.criteria.tarea || '',
        frecuencia: data.criteria.frecuencia?.toString() || '',
        planificacion: data.criteria.planificacion || '',
        provincia: data.criteria.provincia || '',
        tratamiento: data.criteria.tratamiento || '',
        objetosEntregados: data.criteria.objetosEntregados || '',
        linea: data.criteria.linea || '',
        auditCategoria: data.criteria.auditCategoria || '',
        auditMercado: data.criteria.auditMercado || '',
        auditProducto: data.criteria.auditProducto || '',
        auditMolecula: data.criteria.auditMolecula || '',
        porcenDeAplic: data.criteria.porcenDeAplic?.toString() || '',
      });

      // Cargar los productos seleccionados
      const productsMap = new Map<string, number>();
      data.products.forEach((product: ProductQuantity) => {
        productsMap.set(product.codigoSap, product.quantity);
      });
      setSelectedProducts(productsMap);
    } catch (error) {
      console.error('Error loading criteria:', error);
      addNotification('Error al cargar criterio', 'error');
    } finally {
      setLoadingMasterData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Convert selectedProducts Map to array
      const products = Array.from(selectedProducts.entries()).map(([codigoSap, quantity]) => ({
        codigoSap,
        quantity
      }));

      console.log('Selected products Map:', selectedProducts);
      console.log('Products array to send:', products);

      const payload = {
        userId: 1, // TODO: Get from auth context
        ...formData,
        usuarioAlta: 'ADMIN', // TODO: Get from auth context
        products
      };

      console.log('Full payload:', JSON.stringify(payload, null, 2));

      const url = isEditMode
        ? `http://localhost:5001/api/imports/${importId}/criteria/${criteriaId}`
        : `http://localhost:5001/api/imports/${importId}/criteria`;

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(isEditMode ? 'Error al actualizar criterio' : 'Error al crear criterio');
      }

      const result = await response.json();
      console.log(isEditMode ? 'Criteria updated:' : 'Criteria created:', result);

      addNotification(isEditMode ? 'Criterio actualizado exitosamente' : 'Criterio creado exitosamente', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      addNotification(isEditMode ? 'Error al actualizar criterio' : 'Error al crear criterio', 'error');
      console.error('Error saving criteria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProduct = (material: Material) => {
    const newSelected = new Map(selectedProducts);
    newSelected.set(material.codigoSap, 0);
    setSelectedProducts(newSelected);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const handleRemoveProduct = (codigoSap: string) => {
    const newSelected = new Map(selectedProducts);
    newSelected.delete(codigoSap);
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (codigoSap: string, quantity: number) => {
    const newSelected = new Map(selectedProducts);
    newSelected.set(codigoSap, quantity);
    setSelectedProducts(newSelected);
  };

  const filteredMaterials = materials.filter(material => {
    if (!searchTerm) return false;
    const search = searchTerm.toLowerCase();
    return (
      material.codigoSap.toLowerCase().includes(search) ||
      material.description.toLowerCase().includes(search)
    );
  });

  if (loadingMasterData) {
    return (
      <div className="modal-overlay">
        <div className="modal-content modal-xl">
          <div className="loading">Cargando formulario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="criteria-form-overlay">
      <div className="criteria-form-modal">
        <div className="criteria-form-header">
          <h2>{isEditMode ? 'Editar Criterio de Configuración' : 'Nuevo Criterio de Configuración'}</h2>
          <button onClick={onClose} className="criteria-form-close">
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="criteria-form-body">
            <div className="form-layout">
              {/* Columna izquierda: Campos del formulario */}
              <div className="form-fields-section">
                <div className="form-grid">
              {/* Tipo Cliente */}
              <div className="form-group">
                <label htmlFor="tipoCliente">
                  <span className="material-icons">person</span>
                  Tipo Cliente
                </label>
                <select
                  id="tipoCliente"
                  value={formData.tipoCliente}
                  onChange={(e) => handleChange('tipoCliente', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {customerTypes.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campaña */}
              <div className="form-group">
                <label htmlFor="campania">
                  <span className="material-icons">campaign</span>
                  Campaña
                </label>
                <input
                  type="text"
                  id="campania"
                  value={formData.campania}
                  onChange={(e) => handleChange('campania', e.target.value)}
                  placeholder="Ingrese campaña..."
                />
              </div>

              {/* Lugar Visita */}
              <div className="form-group">
                <label htmlFor="lugarVisita">
                  <span className="material-icons">place</span>
                  Lugar Visita
                </label>
                <select
                  id="lugarVisita"
                  value={formData.lugarVisita}
                  onChange={(e) => handleChange('lugarVisita', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {institutionTypes.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institución */}
              <div className="form-group">
                <label htmlFor="institucion">
                  <span className="material-icons">business</span>
                  Institución
                </label>
                <input
                  type="text"
                  id="institucion"
                  value={formData.institucion}
                  onChange={(e) => handleChange('institucion', e.target.value)}
                  placeholder="Ingrese institución..."
                />
              </div>

              {/* Especialidad */}
              <div className="form-group">
                <label htmlFor="especialidad">
                  <span className="material-icons">medical_services</span>
                  Especialidad
                </label>
                <select
                  id="especialidad"
                  value={formData.especialidad}
                  onChange={(e) => handleChange('especialidad', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {specialties.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edad */}
              <div className="form-group">
                <label htmlFor="edad">
                  <span className="material-icons">cake</span>
                  Edad
                </label>
                <input
                  type="number"
                  id="edad"
                  value={formData.edad}
                  onChange={(e) => handleChange('edad', e.target.value)}
                  placeholder="Ingrese edad..."
                />
              </div>

              {/* Sexo */}
              <div className="form-group">
                <label htmlFor="sexo">
                  <span className="material-icons">wc</span>
                  Sexo
                </label>
                <select
                  id="sexo"
                  value={formData.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </div>

              {/* Especialidad Sec */}
              <div className="form-group">
                <label htmlFor="especialidadSec">
                  <span className="material-icons">local_hospital</span>
                  Especialidad Sec
                </label>
                <select
                  id="especialidadSec"
                  value={formData.especialidadSec}
                  onChange={(e) => handleChange('especialidadSec', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {specialties.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Especialidad Cartera */}
              <div className="form-group">
                <label htmlFor="especialidadCartera">
                  <span className="material-icons">work</span>
                  Especialidad Cartera
                </label>
                <select
                  id="especialidadCartera"
                  value={formData.especialidadCartera}
                  onChange={(e) => handleChange('especialidadCartera', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {specialties.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Categoría */}
              <div className="form-group">
                <label htmlFor="categoria">
                  <span className="material-icons">category</span>
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarea */}
              <div className="form-group">
                <label htmlFor="tarea">
                  <span className="material-icons">assignment</span>
                  Tarea
                </label>
                <select
                  id="tarea"
                  value={formData.tarea}
                  onChange={(e) => handleChange('tarea', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Mañana">Mañana</option>
                  <option value="Tarde">Tarde</option>
                </select>
              </div>

              {/* Frecuencia */}
              <div className="form-group">
                <label htmlFor="frecuencia">
                  <span className="material-icons">repeat</span>
                  Frecuencia
                </label>
                <input
                  type="number"
                  id="frecuencia"
                  value={formData.frecuencia}
                  onChange={(e) => handleChange('frecuencia', e.target.value)}
                  placeholder="Ingrese frecuencia..."
                />
              </div>

              {/* Planificación */}
              <div className="form-group">
                <label htmlFor="planificacion">
                  <span className="material-icons">event_note</span>
                  Planificación
                </label>
                <input
                  type="number"
                  id="planificacion"
                  value={formData.planificacion}
                  onChange={(e) => handleChange('planificacion', e.target.value)}
                  placeholder="Ingrese planificación..."
                />
              </div>

              {/* Provincia */}
              <div className="form-group">
                <label htmlFor="provincia">
                  <span className="material-icons">map</span>
                  Provincia
                </label>
                <select
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => handleChange('provincia', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {states.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tratamiento */}
              <div className="form-group">
                <label htmlFor="tratamiento">
                  <span className="material-icons">medication</span>
                  Tratamiento
                </label>
                <input
                  type="text"
                  id="tratamiento"
                  value={formData.tratamiento}
                  onChange={(e) => handleChange('tratamiento', e.target.value)}
                  placeholder="Ingrese tratamiento..."
                />
              </div>

              {/* Objetos Entregados */}
              <div className="form-group">
                <label htmlFor="objetosEntregados">
                  <span className="material-icons">card_giftcard</span>
                  Objetos Entregados
                </label>
                <input
                  type="text"
                  id="objetosEntregados"
                  value={formData.objetosEntregados}
                  onChange={(e) => handleChange('objetosEntregados', e.target.value)}
                  placeholder="Ingrese objetos..."
                />
              </div>

              {/* Línea */}
              <div className="form-group">
                <label htmlFor="linea">
                  <span className="material-icons">timeline</span>
                  Línea
                </label>
                <select
                  id="linea"
                  value={formData.linea}
                  onChange={(e) => handleChange('linea', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {lines.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audit Categoría */}
              <div className="form-group">
                <label htmlFor="auditCategoria">
                  <span className="material-icons">fact_check</span>
                  Audit Categoría
                </label>
                <select
                  id="auditCategoria"
                  value={formData.auditCategoria}
                  onChange={(e) => handleChange('auditCategoria', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {/* Audit Mercado */}
              <div className="form-group">
                <label htmlFor="auditMercado">
                  <span className="material-icons">store</span>
                  Audit Mercado
                </label>
                <select
                  id="auditMercado"
                  value={formData.auditMercado}
                  onChange={(e) => handleChange('auditMercado', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {auditMarkets.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audit Producto */}
              <div className="form-group">
                <label htmlFor="auditProducto">
                  <span className="material-icons">inventory</span>
                  Audit Producto
                </label>
                <select
                  id="auditProducto"
                  value={formData.auditProducto}
                  onChange={(e) => handleChange('auditProducto', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {auditProducts.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audit Molécula */}
              <div className="form-group form-group-full-width">
                <label htmlFor="auditMolecula">
                  <span className="material-icons">science</span>
                  Audit Molécula
                </label>
                <select
                  id="auditMolecula"
                  value={formData.auditMolecula}
                  onChange={(e) => handleChange('auditMolecula', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {auditMolecules.map((item) => (
                    <option key={item.code} value={item.description}>
                      {item.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Porcentaje de Aplicación */}
              <div className="form-group form-group-highlighted">
                <label htmlFor="porcenDeAplic">
                  <span className="material-icons">percent</span>
                  % Aplicación (1-100)
                </label>
                <input
                  type="number"
                  id="porcenDeAplic"
                  min="1"
                  max="100"
                  value={formData.porcenDeAplic}
                  onChange={(e) => handleChange('porcenDeAplic', e.target.value)}
                  placeholder="Ingrese porcentaje..."
                />
              </div>
                </div>
              </div>

              {/* Columna derecha: Selección de productos */}
              <div className="products-sidebar">
                <div className="products-header">
                  <div className="section-title">
                    <span className="material-icons">inventory_2</span>
                    Productos
                  </div>
                </div>

                {/* Búsqueda de productos */}
                <div className="products-search">
                  <div className="search-input-wrapper">
                    <span className="material-icons">search</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Buscar producto por código o descripción..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSearchResults(e.target.value.length > 0);
                      }}
                      onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                    />
                  </div>

                  {/* Resultados de búsqueda */}
                  {showSearchResults && (
                    <div className="search-results">
                      {filteredMaterials.length === 0 ? (
                        <div className="no-search-results">
                          No se encontraron productos
                        </div>
                      ) : (
                        filteredMaterials.slice(0, 10).map((material) => {
                          const isAlreadySelected = selectedProducts.has(material.codigoSap);
                          return (
                            <div
                              key={material.codigoSap}
                              className={`search-result-item ${isAlreadySelected ? 'disabled' : ''}`}
                              onClick={() => !isAlreadySelected && handleAddProduct(material)}
                            >
                              <div className="search-result-code">{material.codigoSap}</div>
                              <div className="search-result-description">{material.description}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Lista de productos seleccionados */}
                <div className="selected-products-section">
                  {selectedProducts.size === 0 ? (
                    <div className="no-products-selected">
                      No hay productos seleccionados
                    </div>
                  ) : (
                    <>
                      <div className="selected-products-title">
                        Productos Seleccionados ({selectedProducts.size})
                      </div>
                      {Array.from(selectedProducts.entries()).map(([codigoSap, quantity]) => {
                        const material = materials.find(m => m.codigoSap === codigoSap);
                        if (!material) return null;

                        return (
                          <div key={codigoSap} className="selected-product-item">
                            <div className="selected-product-header">
                              <div className="selected-product-info">
                                <div className="selected-product-code">{material.codigoSap}</div>
                                <div className="selected-product-description">
                                  {material.description}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="btn-remove-product"
                                onClick={() => handleRemoveProduct(codigoSap)}
                              >
                                <span className="material-icons">close</span>
                              </button>
                            </div>
                            <div className="selected-product-quantity">
                              <label>Cantidad:</label>
                              <input
                                type="number"
                                min="0"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(codigoSap, parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="criteria-form-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar Criterio' : 'Guardar Criterio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
