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
