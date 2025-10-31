using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API;

public partial class VHierarchyView
{
    public int Code { get; set; }

    public string LastName { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int DistrictCode { get; set; }

    public string? DistrictDescription { get; set; }

    public int RegionCode { get; set; }

    public string RegionDescription { get; set; } = null!;

    public int ManagerCode { get; set; }

    public string ManagerDescription { get; set; } = null!;

    public string Status { get; set; } = null!;

    public int RegionManagerCode { get; set; }

    public string? LineCode { get; set; }

    public int? BusinessLineCode { get; set; }

    public string? BusinessLineDescription { get; set; }

    public int? TimelineCode { get; set; }

    public byte[]? MaxStamp { get; set; }

    public int? WorkingCalendarCode { get; set; }

    public int? CountryCode { get; set; }

    public string? RegionsCode { get; set; }

    public decimal? TimeZone { get; set; }

    public string? LegacyCode { get; set; }
}
