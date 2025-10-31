using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class RelationOld
{
    public int Id { get; set; }

    public int RepresentativeCode { get; set; }

    public int SupervisorCode { get; set; }

    public int CriterioId { get; set; }

    public int ImportId { get; set; }

    public int MaterialId { get; set; }

    public int? CantTeorica { get; set; }

    public int? CantDirecta { get; set; }
}
