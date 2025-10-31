using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class StockReal
{
    public int Id { get; set; }

    public int RepresentativeCode { get; set; }

    public int SupervisorCode { get; set; }

    public string MaterialId { get; set; } = null!;

    public int ImportId { get; set; }

    public int Unit { get; set; }

    public int CantEnviar { get; set; }

    public int? CantTeoricaTotal { get; set; }

    public int? CantDirectaTotal { get; set; }

    public int? CantidadAsDirecta { get; set; }

    public int? CantidadAsTeorica { get; set; }

    public virtual Import Import { get; set; } = null!;
}
