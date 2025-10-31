using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class MigrationExistencium
{
    public int Id { get; set; }

    public string? CodigoSap { get; set; }

    public string? MaterialDescription { get; set; }

    public int? Stock { get; set; }

    public int? StockReal { get; set; }

    public int? Pack { get; set; }

    public int? ImportId { get; set; }

    public string? CodigoSapLegacy { get; set; }

    public int? StockManual { get; set; }

    public virtual Import? Import { get; set; }
}
