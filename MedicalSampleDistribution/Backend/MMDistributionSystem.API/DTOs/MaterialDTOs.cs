namespace MMDistributionSystem.API.DTOs;

public class MaterialDto
{
    public int Id { get; set; }
    public string CodigoSap { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int? CurrentStock { get; set; }
    public int? Pack { get; set; }
}

public class MaterialDetailDto
{
    public int Id { get; set; }
    public string CodigoSap { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    // Stock information from V_MaterialesStock if available
    public List<MaterialStockInfo>? StockByImport { get; set; }
}

public class MaterialStockInfo
{
    public int ImportId { get; set; }
    public int? Stock { get; set; }
    public int? StockReal { get; set; }
    public int Pack { get; set; }
    public int? MaxStock { get; set; }
    public int? MinStock { get; set; }
    public bool? UseStockReal { get; set; }
    public int? StockManual { get; set; }
}

public class MaterialListResponse
{
    public List<MaterialDto> Materials { get; set; } = new();
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
}
