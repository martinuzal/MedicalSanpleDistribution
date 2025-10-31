using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class VRepresentative
{
    public int Code { get; set; }

    public string DisplayMember { get; set; } = null!;
}
