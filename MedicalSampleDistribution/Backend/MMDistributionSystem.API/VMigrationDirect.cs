using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class VMigrationDirect
{
    public int Id { get; set; }

    public string? Supervisor { get; set; }

    public string? LegajoSupervisor { get; set; }

    public string? Representante { get; set; }

    public string? LegajoRepresentante { get; set; }

    public string? Excluded { get; set; }

    public int ImportId { get; set; }

    public int? RowId { get; set; }

    public DateTime FechaAlta { get; set; }

    public string UsuarioAlta { get; set; } = null!;

    public DateTime FechaModificacion { get; set; }

    public string UsuarioModificacion { get; set; } = null!;

    public DateTime? FechaBaja { get; set; }

    public string? UsuarioBaja { get; set; }

    public int? Cantidad { get; set; }

    public string? Materiales { get; set; }
}
