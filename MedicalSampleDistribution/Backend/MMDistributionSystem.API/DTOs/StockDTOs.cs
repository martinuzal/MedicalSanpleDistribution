namespace MMDistributionSystem.API.DTOs;

public class StockDto
{
    public int Id { get; set; }
    public string CodigoSap { get; set; } = string.Empty;
    public string MaterialDescription { get; set; } = string.Empty;
    public int? Stock { get; set; }
    public int? StockReal { get; set; }
    public int? StockManual { get; set; }
    public int? Pack { get; set; }
    public int? ImportId { get; set; }
    public DateTime? ImportDate { get; set; }
    public string? ImportState { get; set; }
}

public class StockDetailDto
{
    public int Id { get; set; }
    public string CodigoSap { get; set; } = string.Empty;
    public string MaterialDescription { get; set; } = string.Empty;
    public int? Stock { get; set; }
    public int? StockReal { get; set; }
    public int? StockManual { get; set; }
    public int? Pack { get; set; }
    public int? ImportId { get; set; }
    public string? CodigoSapLegacy { get; set; }

    // Import information
    public DateTime? ImportDate { get; set; }
    public string? ImportState { get; set; }
    public string? UserName { get; set; }
}

public class UpdateStockManualDto
{
    public int? StockManual { get; set; }
}

public class StockListResponse
{
    public List<StockDto> Stocks { get; set; } = new();
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
}

public class StockSummaryDto
{
    public string CodigoSap { get; set; } = string.Empty;
    public string MaterialDescription { get; set; } = string.Empty;
    public int TotalStock { get; set; }
    public int TotalStockReal { get; set; }
    public int ImportCount { get; set; }
}
