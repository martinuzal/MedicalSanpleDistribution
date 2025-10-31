namespace MMDistributionSystem.API.DTOs;

public class MaterialCoverageDto
{
    public string MaterialId { get; set; } = string.Empty;
    public double? CantXCriterioSegmentado { get; set; }
    public double? CantidadCrierioDirecto { get; set; }  // Note: Spelling matches SP column name
    public double? CantTotal { get; set; }
    public double? CantAjustada { get; set; }
    public double? CantDifPackJefe { get; set; }
    public double? CantEnviar { get; set; }
    public decimal? PorcCobert { get; set; }
    public double? Stock { get; set; }
    public double? Pack { get; set; }
    public double? MinStock { get; set; }
    public double? MaxStock { get; set; }
    public decimal? PorcCobertStockMin { get; set; }
    public double? CantEnviarDelegaciones { get; set; }
    public double? CantAjustadaCriterio { get; set; }
    public double? CantAjustadaDirecta { get; set; }
    public double? CantAjustadaTotal { get; set; }
    public double? CantTotalEnviar { get; set; }
    public double? CantTotalAPM { get; set; }
    public string? Semaforo { get; set; }
}

public class CoverageDashboardDto
{
    public int ImportId { get; set; }
    public List<MaterialCoverageDto> Materials { get; set; } = new();
    public CoverageSummaryDto Summary { get; set; } = new();
}

public class CoverageSummaryDto
{
    public int TotalMaterials { get; set; }
    public double TotalStock { get; set; }
    public double TotalCantEnviar { get; set; }
    public decimal AverageCoverage { get; set; }
    public int MaterialsWithNegativeStock { get; set; }
    public int MaterialsWithinRange { get; set; }
}
