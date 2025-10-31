namespace MMDistributionSystem.API.DTOs;

public class DistributionDto
{
    public int Id { get; set; }
    public int RepresentativeCode { get; set; }
    public string RepresentativeName { get; set; } = string.Empty;
    public int SupervisorCode { get; set; }
    public string SupervisorName { get; set; } = string.Empty;
    public string MaterialId { get; set; } = string.Empty;
    public string MaterialDescription { get; set; } = string.Empty;
    public int ImportId { get; set; }
    public DateTime? ImportDate { get; set; }
    public string? ImportState { get; set; }
    public string? LegajoSap { get; set; }
    public int Cant { get; set; }
}

public class DistributionListResponse
{
    public List<DistributionDto> Distributions { get; set; } = new();
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
}

public class DistributionSummaryDto
{
    public int RepresentativeCode { get; set; }
    public string RepresentativeName { get; set; } = string.Empty;
    public int TotalMaterials { get; set; }
    public int TotalQuantity { get; set; }
    public int MaterialsCount { get; set; }
}

public class RepresentativeDistributionDto
{
    public int RepresentativeCode { get; set; }
    public string RepresentativeName { get; set; } = string.Empty;
    public List<MaterialDistributionDto> Materials { get; set; } = new();
    public int TotalQuantity { get; set; }
}

public class MaterialDistributionDto
{
    public string MaterialId { get; set; } = string.Empty;
    public string MaterialDescription { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
