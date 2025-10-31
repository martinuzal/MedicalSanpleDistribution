namespace MMDistributionSystem.API.DTOs;

// DTOs para Criterios de Distribución (MigrationConfiguration)
public class ConfigurationCriteriaDto
{
    public int Id { get; set; }
    public string? TipoCliente { get; set; }
    public string? Campania { get; set; }
    public string? LugarVisita { get; set; }
    public string? Institucion { get; set; }
    public string? Especialidad { get; set; }
    public string? Edad { get; set; }
    public string? Sexo { get; set; }
    public string? EspecialidadSec { get; set; }
    public string? EspecialidadCartera { get; set; }
    public string? Categoria { get; set; }
    public string? Tarea { get; set; }
    public int? Frecuencia { get; set; }
    public string? Planificacion { get; set; }
    public string? Provincia { get; set; }
    public string? Tratamiento { get; set; }
    public string? ObjetosEntregados { get; set; }
    public string? Linea { get; set; }
    public string? AuditCategoria { get; set; }
    public string? AuditMercado { get; set; }
    public string? AuditProducto { get; set; }
    public string? AuditMolecula { get; set; }
    public int? PorcenDeAplic { get; set; }
    public int? CountPreview { get; set; }
    public int? RowId { get; set; }
}

// DTOs para Asignaciones Directas (MigrationDirect)
public class DirectAssignmentDto
{
    public int Id { get; set; }
    public string? Supervisor { get; set; }
    public string? LegajoSupervisor { get; set; }
    public string? Representante { get; set; }
    public string? LegajoRepresentante { get; set; }
    public string? Excluded { get; set; }
    public int? RowId { get; set; }
}

// DTOs para Configuración de Materiales (MigrationMaterial)
public class MaterialConfigurationDto
{
    public int Id { get; set; }
    public string CodigoSap { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Pack { get; set; }
    public int? MaxStock { get; set; }
    public int? MinStock { get; set; }
    public int Maestro { get; set; }
    public bool? UseStockReal { get; set; }
    public int? StockManual { get; set; }
    public int? CurrentStock { get; set; }
}

// DTO combinado para el detalle completo de una Marcación
public class ImportDetailDto
{
    public ImportDto Import { get; set; } = new();
    public List<ConfigurationCriteriaDto> Criteria { get; set; } = new();
    public List<DirectAssignmentDto> DirectAssignments { get; set; } = new();
    public List<MaterialConfigurationDto> Materials { get; set; } = new();
    public ImportStatisticsDto Statistics { get; set; } = new();
}

// Estadísticas generales de la marcación
public class ImportStatisticsDto
{
    public int TotalCriteria { get; set; }
    public int TotalDirectAssignments { get; set; }
    public int TotalMaterials { get; set; }
    public int TotalStock { get; set; }
    public int MaterialsWithMinMax { get; set; }
}
