using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class TmpAuditMarc
{
    public int? CustomerCode { get; set; }

    public string? MercDescripcion { get; set; }

    public string? MercCategoria { get; set; }

    public string? ProdDescripcion { get; set; }

    public string? Molecula { get; set; }

    public int? ImportId { get; set; }
}
