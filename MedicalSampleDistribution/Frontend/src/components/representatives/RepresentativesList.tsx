import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  path?: string[]; // Breadcrumb path
}

interface TreeStats {
  totalRegions: number;
  totalDistricts: number;
  totalManagers: number;
  totalRepresentatives: number;
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

  // UI State
  const [compactView, setCompactView] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const { addNotification } = useNotifications();
  const navigate = useNavigate();

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

  // Calculate tree statistics
  const treeStats = useMemo<TreeStats>(() => {
    const regionsSet = new Set<number>();
    const districtsSet = new Set<string>();
    const managersSet = new Set<string>();

    representatives.forEach(rep => {
      if (rep.regionCode) regionsSet.add(rep.regionCode);
      if (rep.regionCode && rep.districtCode) {
        districtsSet.add(`${rep.regionCode}-${rep.districtCode}`);
      }
      if (rep.regionCode && rep.districtCode && rep.managerCode) {
        managersSet.add(`${rep.regionCode}-${rep.districtCode}-${rep.managerCode}`);
      }
    });

    return {
      totalRegions: regionsSet.size,
      totalDistricts: districtsSet.size,
      totalManagers: managersSet.size,
      totalRepresentatives: representatives.length
    };
  }, [representatives]);

  const treeData = useMemo(() => {
    const tree: TreeNode[] = [];
    const regionsMap = new Map<number, TreeNode>();
    const districtsMap = new Map<string, TreeNode>();
    const managersMap = new Map<string, TreeNode>();

    representatives.forEach(rep => {
      if (!rep.regionCode || !rep.districtCode || !rep.managerCode) return;

      const regionName = rep.regionDescription || `Región ${rep.regionCode}`;
      const districtName = rep.districtDescription || `Distrito ${rep.districtCode}`;
      const managerName = rep.managerDescription || `Manager ${rep.managerCode}`;

      // Create or get region node
      if (!regionsMap.has(rep.regionCode)) {
        const regionNode: TreeNode = {
          id: `region-${rep.regionCode}`,
          type: 'region',
          code: rep.regionCode,
          name: regionName,
          children: [],
          isExpanded: expandedNodes.has(`region-${rep.regionCode}`),
          path: [regionName]
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
          name: districtName,
          children: [],
          isExpanded: expandedNodes.has(`district-${districtKey}`),
          path: [regionName, districtName]
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
          name: managerName,
          children: [],
          isExpanded: expandedNodes.has(`manager-${managerKey}`),
          path: [regionName, districtName, managerName]
        };
        managersMap.set(managerKey, managerNode);
        districtNode.children!.push(managerNode);
      }
      const managerNode = managersMap.get(managerKey)!;

      // Add representative node
      const repName = rep.description || `${rep.firstName} ${rep.lastName}`;
      const repNode: TreeNode = {
        id: `rep-${rep.code}`,
        type: 'representative',
        code: rep.code,
        name: repName,
        representative: rep,
        path: [regionName, districtName, managerName, repName]
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

  const exportToCSV = useCallback(() => {
    if (representatives.length === 0) {
      addNotification('No hay datos para exportar', 'warning');
      return;
    }

    const headers = ['Código', 'Nombre', 'Apellido', 'Región', 'Distrito', 'Manager', 'Línea de Negocio', 'Código Legacy'];
    const rows = representatives.map(rep => [
      rep.code,
      rep.firstName || '',
      rep.lastName || '',
      rep.regionDescription || '',
      rep.districtDescription || '',
      rep.managerDescription || '',
      rep.businessLineDescription || '',
      rep.legacyCode || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `representantes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    addNotification('Exportación completada', 'success');
  }, [representatives, addNotification]);

  const exportToJSON = useCallback(() => {
    if (representatives.length === 0) {
      addNotification('No hay datos para exportar', 'warning');
      return;
    }

    const jsonContent = JSON.stringify(representatives, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `representantes_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    addNotification('Exportación completada', 'success');
  }, [representatives, addNotification]);

  const highlightMatch = (text: string, search: string): JSX.Element => {
    if (!search.trim()) return <>{text}</>;

    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const renderTreeNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isHovered = hoveredNode === node.id;
    const isSelected = selectedNode === node.id;

    const getNodeIcon = () => {
      switch (node.type) {
        case 'region': return 'public';
        case 'district': return 'location_city';
        case 'manager': return 'supervisor_account';
        case 'representative': return 'person';
      }
    };

    const getNodeClass = () => {
      const classes = [`tree-node`, `tree-node-${node.type}`, `tree-level-${level}`];
      if (compactView) classes.push('compact');
      if (isHovered) classes.push('hovered');
      if (isSelected) classes.push('selected');
      return classes.join(' ');
    };

    const handleNodeClick = () => {
      if (hasChildren) {
        toggleNode(node.id);
      } else if (node.type === 'representative' && node.representative) {
        // Navigate to representative dashboard
        navigate(`/representantes/${node.representative.code}/dashboard`);
      }
      setSelectedNode(node.id);
    };

    return (
      <div key={node.id} className="tree-item">
        <div
          className={getNodeClass()}
          onClick={handleNodeClick}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}
          title={node.path?.join(' > ')}
        >
          {/* Connection line */}
          {level > 0 && <div className="tree-line"></div>}

          {hasChildren && (
            <span className={`material-icons expand-icon ${isExpanded ? 'expanded' : ''}`}>
              {isExpanded ? 'expand_more' : 'chevron_right'}
            </span>
          )}
          {!hasChildren && <span className="tree-spacer"></span>}

          <span className="material-icons node-icon">{getNodeIcon()}</span>

          <span className="node-label">
            {highlightMatch(node.name, searchText)}
          </span>

          {node.type === 'representative' && node.representative && !compactView && (
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
            <span className="node-count" title={`${node.children!.length} elementos`}>
              ({node.children!.length})
            </span>
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

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-region">
          <span className="material-icons stat-icon">public</span>
          <div className="stat-content">
            <div className="stat-value">{treeStats.totalRegions}</div>
            <div className="stat-label">Regiones</div>
          </div>
        </div>
        <div className="stat-card stat-district">
          <span className="material-icons stat-icon">location_city</span>
          <div className="stat-content">
            <div className="stat-value">{treeStats.totalDistricts}</div>
            <div className="stat-label">Distritos</div>
          </div>
        </div>
        <div className="stat-card stat-manager">
          <span className="material-icons stat-icon">supervisor_account</span>
          <div className="stat-content">
            <div className="stat-value">{treeStats.totalManagers}</div>
            <div className="stat-label">Managers</div>
          </div>
        </div>
        <div className="stat-card stat-representative">
          <span className="material-icons stat-icon">people</span>
          <div className="stat-content">
            <div className="stat-value">{treeStats.totalRepresentatives}</div>
            <div className="stat-label">Representantes</div>
          </div>
        </div>
      </div>

      {/* Tree Controls */}
      <div className="tree-controls">
        <div className="tree-info">
          <span className="material-icons">account_tree</span>
          <span>Vista jerárquica</span>
        </div>
        <div className="tree-actions">
          <button
            className={`btn-tree-action ${compactView ? 'active' : ''}`}
            onClick={() => setCompactView(!compactView)}
            title="Vista compacta"
          >
            <span className="material-icons">{compactView ? 'view_headline' : 'view_compact'}</span>
            {compactView ? 'Normal' : 'Compacta'}
          </button>
          <button className="btn-tree-action" onClick={expandAll}>
            <span className="material-icons">unfold_more</span>
            Expandir todo
          </button>
          <button className="btn-tree-action" onClick={collapseAll}>
            <span className="material-icons">unfold_less</span>
            Colapsar todo
          </button>
          <div className="tree-actions-divider"></div>
          <button className="btn-tree-action btn-export" onClick={exportToCSV} title="Exportar a CSV">
            <span className="material-icons">file_download</span>
            CSV
          </button>
          <button className="btn-tree-action btn-export" onClick={exportToJSON} title="Exportar a JSON">
            <span className="material-icons">code</span>
            JSON
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
