using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class UserType
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;

    public string Status { get; set; } = null!;

    public virtual ICollection<WebUser> WebUsers { get; set; } = new List<WebUser>();
}
