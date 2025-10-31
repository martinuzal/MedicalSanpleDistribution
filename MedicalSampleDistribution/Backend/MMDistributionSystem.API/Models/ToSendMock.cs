using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class ToSendMock
{
    public int Id { get; set; }

    public int? CodigoSap { get; set; }

    public string? DescriptionMaterial { get; set; }

    public int? Cantidad { get; set; }

    public int? ImportId { get; set; }

    public virtual Import? Import { get; set; }
}
