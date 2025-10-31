using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class VState
{
    public int Code { get; set; }

    public string FullDesc { get; set; } = null!;
}
