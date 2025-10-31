using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class Abmstock
{
    public int Id { get; set; }

    public string? CodigoSap { get; set; }

    public string? DescriptionMaterial { get; set; }

    public double? Cantidad { get; set; }

    public string? MaxStockaDistribuir { get; set; }

    public string? MinStockADistribuir { get; set; }
}
