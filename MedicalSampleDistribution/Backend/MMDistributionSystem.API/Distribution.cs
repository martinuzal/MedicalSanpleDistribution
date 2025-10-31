using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class Distribution
{
    public int Id { get; set; }

    public int RepresentativeCode { get; set; }

    public int SupervisorCode { get; set; }

    public string MaterialId { get; set; } = null!;

    public int ImportId { get; set; }

    public string? LegajoSap { get; set; }

    public int Cant { get; set; }

    public virtual Import Import { get; set; } = null!;
}
