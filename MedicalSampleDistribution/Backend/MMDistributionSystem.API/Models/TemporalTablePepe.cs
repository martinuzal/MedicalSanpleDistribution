using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class TemporalTablePepe
{
    public int? RepresentativeCode { get; set; }

    public int? MaterialId { get; set; }

    public double CantXcriterioSegmentado { get; set; }

    public double CantidadCrierioDirecto { get; set; }

    public double CantTotal { get; set; }

    public double CantAjustada { get; set; }

    public double? CantdifPackJefe { get; set; }

    public double? CantEnviar { get; set; }

    public int? Isfeje { get; set; }
}
