using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class StockDelivery
{
    public int Id { get; set; }

    public int RepresentativeCode { get; set; }

    public int SupervisorCode { get; set; }

    public string MaterialId { get; set; } = null!;

    public int ImportId { get; set; }

    public int CantTeoricaTotal { get; set; }

    public int CantAjusteTotal { get; set; }

    public int CantEnviar { get; set; }

    public virtual Import Import { get; set; } = null!;
}
