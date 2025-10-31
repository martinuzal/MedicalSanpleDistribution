using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class Mmaestro
{
    public int Id { get; set; }

    public int? CodigoSap { get; set; }

    public string? DescriptionMaterial { get; set; }

    public int? Pack { get; set; }

    public string? IncluirColumna { get; set; }

    public int? MaxStockAdistribuir { get; set; }

    public int? MinStockAdistribuir { get; set; }

    public DateTime FechaAlta { get; set; }

    public string UsuarioAlta { get; set; } = null!;

    public DateTime FechaModificacion { get; set; }

    public string UsuarioModificacion { get; set; } = null!;

    public DateTime? FechaBaja { get; set; }

    public string? UsuarioBaja { get; set; }
}
