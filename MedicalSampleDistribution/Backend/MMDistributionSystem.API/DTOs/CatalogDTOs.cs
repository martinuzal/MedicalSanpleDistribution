namespace MMDistributionSystem.API.DTOs;

// DTOs genéricos para catálogos simples
public class CatalogItemDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class CategoryDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class CustomerTypeDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class SpecialtyDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class InstitutionTypeDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class StateDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class LineDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class RepresentativeDto
{
    public int Code { get; set; }
    public string DisplayMember { get; set; } = string.Empty;
}

public class SupervisorDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class AuditMarketDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class AuditMoleculeDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class AuditProductDto
{
    public string Code { get; set; } = string.Empty;
    public string DisplayMember { get; set; } = string.Empty;
}

public class MaterialStockDto
{
    public string CodigoSap { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? Stock { get; set; }
    public int? Pack { get; set; }
}
