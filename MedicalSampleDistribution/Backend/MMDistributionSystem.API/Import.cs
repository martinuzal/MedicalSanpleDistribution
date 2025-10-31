using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class Import
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime ImportDate { get; set; }

    public string? State { get; set; }

    public string? FileNameExistencia { get; set; }

    public string? FileNameAsignacion { get; set; }

    public string? FileBase { get; set; }

    public DateTime FechaAlta { get; set; }

    public string UsuarioAlta { get; set; } = null!;

    public DateTime FechaModificacion { get; set; }

    public string UsuarioModificacion { get; set; } = null!;

    public DateTime? FechaBaja { get; set; }

    public string? UsuarioBaja { get; set; }

    public virtual ICollection<DistributionOld> DistributionOlds { get; set; } = new List<DistributionOld>();

    public virtual ICollection<Distribution> Distributions { get; set; } = new List<Distribution>();

    public virtual ICollection<MigrationAssignment> MigrationAssignments { get; set; } = new List<MigrationAssignment>();

    public virtual ICollection<MigrationConfiguration> MigrationConfigurations { get; set; } = new List<MigrationConfiguration>();

    public virtual ICollection<MigrationDirect> MigrationDirects { get; set; } = new List<MigrationDirect>();

    public virtual ICollection<MigrationExistencium> MigrationExistencia { get; set; } = new List<MigrationExistencium>();

    public virtual ICollection<ToSendMock> ToSendMocks { get; set; } = new List<ToSendMock>();

    public virtual WebUser User { get; set; } = null!;
}
