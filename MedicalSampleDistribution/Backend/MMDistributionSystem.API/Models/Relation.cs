using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class Relation
{
    public int Id { get; set; }

    public int RepresentativeCode { get; set; }

    public int SupervisorCode { get; set; }

    public int CriterioId { get; set; }

    public int ImportId { get; set; }

    public string MaterialId { get; set; } = null!;

    public int? CantTeorica { get; set; }

    public int? CantDirecta { get; set; }

    public virtual Import Import { get; set; } = null!;
}
