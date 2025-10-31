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

    // Representative History DTOs
    public class RepresentativeHistoryItemDto
    {
        public int Code { get; set; }
        public string? Representante { get; set; }
        public string? Supervisor { get; set; }
        public string? Region { get; set; }
        public string? Material { get; set; }
        public string? CodigoSap { get; set; }
        public DateTime ImportDate { get; set; }
        public string? State { get; set; }
        public int CantEnviar { get; set; }
    }

    public class RepresentativeHistoryDto
    {
        public List<RepresentativeHistoryItemDto> History { get; set; } = new();
        public int TotalCount { get; set; }
        public RepresentativeInfoDto? RepresentativeInfo { get; set; }
    }

    public class RepresentativeInfoDto
    {
        public int Code { get; set; }
        public string? Name { get; set; }
        public string? Supervisor { get; set; }
        public string? Region { get; set; }
    }
}
