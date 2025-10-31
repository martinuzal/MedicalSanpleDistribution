using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class MigrationMaterial
{
    public int Id { get; set; }

    public string CodigoSap { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Pack { get; set; }

    public int? MaxStock { get; set; }

    public int? MinStock { get; set; }

    public int ImportId { get; set; }

    public int Maestro { get; set; }

    public bool? UseStockReal { get; set; }

    public int? StockManual { get; set; }
}
