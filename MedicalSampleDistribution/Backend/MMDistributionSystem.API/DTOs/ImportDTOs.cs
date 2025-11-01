namespace MMDistributionSystem.API.DTOs;

public class ImportDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public DateTime ImportDate { get; set; }
    public string? State { get; set; }
    public string? FileNameExistencia { get; set; }
    public string? FileNameAsignacion { get; set; }
    public string? FileBase { get; set; }
    public DateTime FechaAlta { get; set; }
    public string UsuarioAlta { get; set; } = null!;
    public DateTime FechaModificacion { get; set; }
    public string UsuarioModificacion { get; set; } = null!;
}

public class CreateImportDto
{
    public int UserId { get; set; }
    public DateTime ImportDate { get; set; }
    public string? State { get; set; }
    public string? FileNameExistencia { get; set; }
    public string? FileNameAsignacion { get; set; }
    public string? FileBase { get; set; }
    public string UsuarioAlta { get; set; } = null!;
}

public class UpdateImportDto
{
    public string? State { get; set; }
    public string? FileNameExistencia { get; set; }
    public string? FileNameAsignacion { get; set; }
    public string? FileBase { get; set; }
    public string UsuarioModificacion { get; set; } = null!;
}

public class ImportListResponse
{
    public List<ImportDto> Imports { get; set; } = new();
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
}

public class CreateCriteriaDto
{
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
    public string? Frecuencia { get; set; }
    public string? Planificacion { get; set; }
    public string? Provincia { get; set; }
    public string? Tratamiento { get; set; }
    public string? ObjetosEntregados { get; set; }
    public string? Linea { get; set; }
    public string? AuditCategoria { get; set; }
    public string? AuditMercado { get; set; }
    public string? AuditProducto { get; set; }
    public string? AuditMolecula { get; set; }
    public string? PorcenDeAplic { get; set; }
    public string UsuarioAlta { get; set; } = null!;
    public List<ProductAssignmentDto>? Products { get; set; }
}

public class ProductAssignmentDto
{
    public string CodigoSap { get; set; } = null!;
    public int Quantity { get; set; }
}

public class CreateDirectAssignmentDto
{
    public string? Supervisor { get; set; }
    public string? LegajoSupervisor { get; set; }
    public string? Representante { get; set; }
    public string? LegajoRepresentante { get; set; }
    public string? Excluded { get; set; }
    public string UsuarioAlta { get; set; } = null!;
    public List<ProductAssignmentDto>? Products { get; set; }
}

public class DirectAssignmentDetailDto
{
    public string? Supervisor { get; set; }
    public string? LegajoSupervisor { get; set; }
    public string? Representante { get; set; }
    public string? LegajoRepresentante { get; set; }
    public string? Excluded { get; set; }
    public List<ProductQuantityDto>? Products { get; set; }
}

public class ProductQuantityDto
{
    public string CodigoSap { get; set; } = null!;
    public int Quantity { get; set; }
}
