namespace MMDistributionSystem.API.DTOs
{
    public class RepresentativeDetailDto
    {
        public int Code { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Description { get; set; }
        public int? DistrictCode { get; set; }
        public string? DistrictDescription { get; set; }
        public int? RegionCode { get; set; }
        public string? RegionDescription { get; set; }
        public int? ManagerCode { get; set; }
        public string? ManagerDescription { get; set; }
        public string? Status { get; set; }
        public int? RegionManagerCode { get; set; }
        public int? BusinessLineCode { get; set; }
        public string? BusinessLineDescription { get; set; }
        public string? LegacyCode { get; set; }
    }

    public class RepresentativesListDto
    {
        public List<RepresentativeDetailDto> Representatives { get; set; } = new();
        public int TotalCount { get; set; }
    }

    public class RepresentativeFiltersDto
    {
        public List<RegionFilterDto> Regions { get; set; } = new();
        public List<DistrictFilterDto> Districts { get; set; } = new();
        public List<ManagerFilterDto> Managers { get; set; } = new();
        public List<BusinessLineFilterDto> BusinessLines { get; set; } = new();
    }

    public class RegionFilterDto
    {
        public int Code { get; set; }
        public string? Description { get; set; }
    }

    public class DistrictFilterDto
    {
        public int Code { get; set; }
        public string? Description { get; set; }
    }

    public class ManagerFilterDto
    {
        public int Code { get; set; }
        public string? Description { get; set; }
    }

    public class BusinessLineFilterDto
    {
        public int Code { get; set; }
        public string? Description { get; set; }
    }
}
