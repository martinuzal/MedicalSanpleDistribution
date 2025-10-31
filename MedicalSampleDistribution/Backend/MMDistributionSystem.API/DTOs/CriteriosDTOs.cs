namespace MMDistributionSystem.API.DTOs;

public class CriterioDto
{
    public string? Criterio { get; set; }
    public string? Material { get; set; }
    public string? MaterialId { get; set; }
}

public class CriteriosListDto
{
    public int ImportId { get; set; }
    public List<CriterioDto> Criterios { get; set; } = new();
}
