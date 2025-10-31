using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class MigrationDirect
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

    public virtual Import Import { get; set; } = null!;
}
