using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class WebUser
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string UserName { get; set; } = null!;

    public byte[] Password { get; set; } = null!;

    public int? UserTypeId { get; set; }

    public string Status { get; set; } = null!;

    public virtual ICollection<Import> Imports { get; set; } = new List<Import>();

    public virtual UserType? UserType { get; set; }
}
