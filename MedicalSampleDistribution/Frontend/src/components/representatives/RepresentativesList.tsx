import { useState, useEffect, useMemo } from 'react';
import { representativesService } from '../../services/representativesService';
import { useNotifications } from '../../contexts/NotificationContext';
import type { RepresentativeDetail, RepresentativesFilters } from '../../types/representatives';
import './RepresentativesList.css';

interface TreeNode {
  id: string;
  type: 'region' | 'district' | 'manager' | 'representative';
  code: number;
  name: string;
  children?: TreeNode[];
  representative?: RepresentativeDetail;
  isExpanded?: boolean;
}

export default function RepresentativesList() {
  const [representatives, setRepresentatives] = useState<RepresentativeDetail[]>([]);
  const [filters, setFilters] = useState<RepresentativesFilters | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Filters
  const [filterRegion, setFilterRegion] = useState<number | null>(null);
  const [filterDistrict, setFilterDistrict] = useState<number | null>(null);
  const [filterManager, setFilterManager] = useState<number | null>(null);
  const [filterBusinessLine, setFilterBusinessLine] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  const { addNotification } = useNotifications();

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadRepresentatives();
  }, [filterRegion, filterDistrict, filterManager, filterBusinessLine, searchText]);

  const loadFilters = async () => {
    try {
      const filtersData = await representativesService.getFilters();
      setFilters(filtersData);
    } catch (error) {
      addNotification('Error al cargar filtros', 'error');
      console.error('Error loading filters:', error);
    }
  };

  const loadRepresentatives = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterRegion) params.regionCode = filterRegion;
      if (filterDistrict) params.districtCode = filterDistrict;
      if (filterManager) params.managerCode = filterManager;
      if (filterBusinessLine) params.businessLineCode = filterBusinessLine;
      if (searchText) params.search = searchText;

      const data = await representativesService.getRepresentatives(params);
      setRepresentatives(data.representatives);
    } catch (error) {
      addNotification('Error al cargar representantes', 'error');
      console.error('Error loading representatives:', error);
    } finally {
      setLoading(false);
    }
  };

  const treeData = useMemo(() => {
    const tree: TreeNode[] = [];
    const regionsMap = new Map<number, TreeNode>();
    const districtsMap = new Map<string, TreeNode>();
    const managersMap = new Map<string, TreeNode>();

    representatives.forEach(rep => {
      if (!rep.regionCode || !rep.districtCode || !rep.managerCode) return;

      // Create or get region node
      if (!regionsMap.has(rep.regionCode)) {
        const regionNode: TreeNode = {
          id: `region-${rep.regionCode}`,
          type: 'region',
          code: rep.regionCode,
          name: rep.regionDescription || `Región ${rep.regionCode}`,
          children: [],
          isExpanded: expandedNodes.has(`region-${rep.regionCode}`)
        };
        regionsMap.set(rep.regionCode, regionNode);
        tree.push(regionNode);
      }
      const regionNode = regionsMap.get(rep.regionCode)!;

      // Create or get district node
      const districtKey = `${rep.regionCode}-${rep.districtCode}`;
      if (!districtsMap.has(districtKey)) {
        const districtNode: TreeNode = {
          id: `district-${districtKey}`,
          type: 'district',
          code: rep.districtCode,
          name: rep.districtDescription || `Distrito ${rep.districtCode}`,
          children: [],
          isExpanded: expandedNodes.has(`district-${districtKey}`)
        };
        districtsMap.set(districtKey, districtNode);
        regionNode.children!.push(districtNode);
      }
      const districtNode = districtsMap.get(districtKey)!;

      // Create or get manager node
      const managerKey = `${districtKey}-${rep.managerCode}`;
      if (!managersMap.has(managerKey)) {
        const managerNode: TreeNode = {
          id: `manager-${managerKey}`,
          type: 'manager',
          code: rep.managerCode,
          name: rep.managerDescription || `Manager ${rep.managerCode}`,
          children: [],
          isExpanded: expandedNodes.has(`manager-${managerKey}`)
        };
        managersMap.set(managerKey, managerNode);
        districtNode.children!.push(managerNode);
      }
      const managerNode = managersMap.get(managerKey)!;

      // Add representative node
      const repNode: TreeNode = {
        id: `rep-${rep.code}`,
        type: 'representative',
        code: rep.code,
        name: rep.description || `${rep.firstName} ${rep.lastName}`,
        representative: rep
      };
      managerNode.children!.push(repNode);
    });

    return tree;
  }, [representatives, expandedNodes]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allNodeIds = new Set<string>();
    const collectNodeIds = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allNodeIds.add(node.id);
          collectNodeIds(node.children);
        }
      });
    };
    collectNodeIds(treeData);
    setExpandedNodes(allNodeIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const clearFilters = () => {
    setFilterRegion(null);
    setFilterDistrict(null);
    setFilterManager(null);
    setFilterBusinessLine(null);
    setSearchText('');
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    const getNodeIcon = () => {
      switch (node.type) {
        case 'region': return 'public';
        case 'district': return 'location_city';
        case 'manager': return 'supervisor_account';
        case 'representative': return 'person';
      }
    };

    const getNodeClass = () => {
      return `tree-node tree-node-${node.type} tree-level-${level}`;
    };

    return (
      <div key={node.id} className="tree-item">
        <div
          className={getNodeClass()}
          onClick={() => hasChildren && toggleNode(node.id)}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
        >
          {hasChildren && (
            <span className="material-icons expand-icon">
              {isExpanded ? 'expand_more' : 'chevron_right'}
            </span>
          )}
          {!hasChildren && <span className="tree-spacer"></span>}

          <span className="material-icons node-icon">{getNodeIcon()}</span>

          <span className="node-label">{node.name}</span>

          {node.type === 'representative' && node.representative && (
            <div className="rep-details">
              <span className="rep-code">#{node.representative.code}</span>
              {node.representative.businessLineDescription && (
                <span className="rep-line">{node.representative.businessLineDescription}</span>
              )}
              {node.representative.legacyCode && (
                <span className="rep-legacy">Legacy: {node.representative.legacyCode}</span>
              )}
            </div>
          )}

          {hasChildren && (
            <span className="node-count">({node.children!.length})</span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="tree-children">
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading && !representatives.length) {
    return (
      <div className="representatives-list">
        <div className="loading">Cargando representantes...</div>
      </div>
    );
  }

  return (
    <div className="representatives-list">
      <div className="page-header">
        <h1>Representantes</h1>
        <p className="page-description">
          Visualización jerárquica de representantes activos
        </p>
      </div>

      {/* Filters Section */}
      <div className="filters-section-enhanced">
        <div className="filter-header">
          <span className="material-icons">filter_list</span>
          <span className="filter-title">Filtros</span>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre, código..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          {searchText && (
            <button className="btn-clear-search" onClick={() => setSearchText('')}>
              <span className="material-icons">clear</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="filters-grid-enhanced">
          <div className="filter-group-enhanced">
            <label htmlFor="region-filter">
              <span className="material-icons">public</span>
              Región
            </label>
            <select
              id="region-filter"
              value={filterRegion || ''}
              onChange={(e) => setFilterRegion(e.target.value ? parseInt(e.target.value) : null)}
              className="filter-select-enhanced"
            >
              <option value="">Todas las regiones</option>
              {filters?.regions.map(region => (
                <option key={region.code} value={region.code}>
                  {region.description}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group-enhanced">
            <label htmlFor="district-filter">
              <span className="material-icons">location_city</span>
              Distrito
            </label>
            <select
              id="district-filter"
              value={filterDistrict || ''}
              onChange={(e) => setFilterDistrict(e.target.value ? parseInt(e.target.value) : null)}
              className="filter-select-enhanced"
            >
              <option value="">Todos los distritos</option>
              {filters?.districts.map(district => (
                <option key={district.code} value={district.code}>
                  {district.description}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group-enhanced">
            <label htmlFor="manager-filter">
              <span className="material-icons">supervisor_account</span>
              Manager
            </label>
            <select
              id="manager-filter"
              value={filterManager || ''}
              onChange={(e) => setFilterManager(e.target.value ? parseInt(e.target.value) : null)}
              className="filter-select-enhanced"
            >
              <option value="">Todos los managers</option>
              {filters?.managers.map(manager => (
                <option key={manager.code} value={manager.code}>
                  {manager.description}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group-enhanced">
            <label htmlFor="businessline-filter">
              <span className="material-icons">business_center</span>
              Línea de Negocio
            </label>
            <select
              id="businessline-filter"
              value={filterBusinessLine || ''}
              onChange={(e) => setFilterBusinessLine(e.target.value ? parseInt(e.target.value) : null)}
              className="filter-select-enhanced"
            >
              <option value="">Todas las líneas</option>
              {filters?.businessLines.map(line => (
                <option key={line.code} value={line.code}>
                  {line.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        {(filterRegion || filterDistrict || filterManager || filterBusinessLine || searchText) && (
          <button className="btn-clear-filter" onClick={clearFilters}>
            <span className="material-icons">clear_all</span>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tree Controls */}
      <div className="tree-controls">
        <div className="tree-info">
          <span className="material-icons">people</span>
          <span>{representatives.length} representantes encontrados</span>
        </div>
        <div className="tree-actions">
          <button className="btn-tree-action" onClick={expandAll}>
            <span className="material-icons">unfold_more</span>
            Expandir todo
          </button>
          <button className="btn-tree-action" onClick={collapseAll}>
            <span className="material-icons">unfold_less</span>
            Colapsar todo
          </button>
        </div>
      </div>

      {/* Tree View */}
      <div className="tree-container">
        {treeData.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">search_off</span>
            <p>No se encontraron representantes con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="tree-root">
            {treeData.map(node => renderTreeNode(node))}
          </div>
        )}
      </div>
    </div>
  );
}
