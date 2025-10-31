using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class Material
{
    public int Id { get; set; }

    public string CodigoSap { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string Status { get; set; } = null!;
}
