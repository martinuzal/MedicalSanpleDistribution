namespace MMDistributionSystem.API.DTOs;

public class MaterialDetailByRepSupDto
{
    public string? Supervisor { get; set; }
    public string? RepresentativeCode { get; set; }
    public string? MaterialId { get; set; }
    public double? CantEnviar { get; set; }
    public int? IsJefe { get; set; }
}

public class MaterialDetailDashboardDto
{
    public int ImportId { get; set; }
    public string MaterialId { get; set; } = string.Empty;
    public string MaterialName { get; set; } = string.Empty;
    public List<MaterialDetailByRepSupDto> Details { get; set; } = new();
    public MaterialDetailSummaryDto Summary { get; set; } = new();
}

public class MaterialDetailSummaryDto
{
    public int TotalRecords { get; set; }
    public int TotalRepresentantes { get; set; }
    public int TotalSupervisores { get; set; }
    public double TotalCantEnviar { get; set; }
    public int TotalJefes { get; set; }
    public double CantEnviarJefes { get; set; }
    public double CantEnviarRepresentantes { get; set; }
}