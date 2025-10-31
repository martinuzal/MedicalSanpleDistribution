using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class MigrationAssignment
{
    public int Id { get; set; }

    public string? CodigoSap { get; set; }

    public int? Value { get; set; }

    public int ImportId { get; set; }

    public int Direct { get; set; }

    public int RowId { get; set; }

    public int? AssignationId { get; set; }

    public virtual Import Import { get; set; } = null!;
}
