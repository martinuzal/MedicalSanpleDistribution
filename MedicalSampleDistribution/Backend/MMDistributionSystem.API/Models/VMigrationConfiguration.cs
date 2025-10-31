using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class VMigrationConfiguration
{
    public int Id { get; set; }

    public string? TipoCliente { get; set; }

    public string? Campania { get; set; }

    public string? LugarVisita { get; set; }

    public string? Institucion { get; set; }

    public string? Especialidad { get; set; }

    public string? Edad { get; set; }

    public string? Sexo { get; set; }

    public string? EspecialidadSec { get; set; }

    public string? EspecialidadCartera { get; set; }

    public string? Categoria { get; set; }

    public string? Tarea { get; set; }

    public int? Frecuencia { get; set; }

    public string? Planificacion { get; set; }

    public string? Provincia { get; set; }

    public string? Tratamiento { get; set; }

    public string? ObjetosEntregados { get; set; }

    public string? Linea { get; set; }

    public string? AuditCategoria { get; set; }

    public string? AuditMercado { get; set; }

    public string? AuditProducto { get; set; }

    public string? AuditMolecula { get; set; }

    public int ImportId { get; set; }

    public int? RowId { get; set; }

    public DateTime FechaAlta { get; set; }

    public string UsuarioAlta { get; set; } = null!;

    public DateTime FechaModificacion { get; set; }

    public string UsuarioModificacion { get; set; } = null!;

    public DateTime? FechaBaja { get; set; }

    public string? UsuarioBaja { get; set; }

    public int? PorcenDeAplic { get; set; }

    public int? CountPreview { get; set; }

    public int? Cantidad { get; set; }

    public string? Materiales { get; set; }
}
