using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class VMaterialesStock
{
    public int Id { get; set; }

    public string? CodigoSap { get; set; }

    public int? Stock { get; set; }

    public int? StockReal { get; set; }

    public string Description { get; set; } = null!;

    public int Pack { get; set; }

    public int? MaxStock { get; set; }

    public int? MinStock { get; set; }

    public int ImportId { get; set; }

    public int Maestro { get; set; }

    public bool? UseStockReal { get; set; }

    public int? StockManual { get; set; }
}
