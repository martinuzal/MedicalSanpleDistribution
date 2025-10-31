using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMDistributionSystem.API.Data;
using MMDistributionSystem.API.DTOs;

namespace MMDistributionSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogsController : ControllerBase
{
    private readonly MaterialPlanningDbContext _context;
    private readonly ILogger<CatalogsController> _logger;

    public CatalogsController(MaterialPlanningDbContext context, ILogger<CatalogsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        try
        {
            var categories = await _context.VCategories
                .Select(c => new CategoryDto
                {
                    Code = c.Code.ToString(),
                    DisplayMember = c.FullDesc
                })
                .OrderBy(c => c.DisplayMember)
                .ToListAsync();

            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener categorías");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("customer-types")]
    public async Task<ActionResult<List<CustomerTypeDto>>> GetCustomerTypes()
    {
        try
        {
            var customerTypes = await _context.VCustomerTypes
                .Select(ct => new CustomerTypeDto
                {
                    Code = ct.Code.ToString(),
                    DisplayMember = ct.FullDesc
                })
                .OrderBy(ct => ct.DisplayMember)
                .ToListAsync();

            return Ok(customerTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tipos de cliente");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("specialties")]
    public async Task<ActionResult<List<SpecialtyDto>>> GetSpecialties()
    {
        try
        {
            var specialties = await _context.VSpecialties
                .Select(s => new SpecialtyDto
                {
                    Code = s.Code.ToString(),
                    DisplayMember = s.FullDesc
                })
                .OrderBy(s => s.DisplayMember)
                .ToListAsync();

            return Ok(specialties);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener especialidades");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("institution-types")]
    public async Task<ActionResult<List<InstitutionTypeDto>>> GetInstitutionTypes()
    {
        try
        {
            var institutionTypes = await _context.VInstitutionTypes
                .Select(it => new InstitutionTypeDto
                {
                    Code = it.Code.ToString(),
                    DisplayMember = it.FullDesc
                })
                .OrderBy(it => it.DisplayMember)
                .ToListAsync();

            return Ok(institutionTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tipos de institución");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("states")]
    public async Task<ActionResult<List<StateDto>>> GetStates()
    {
        try
        {
            var states = await _context.VStates
                .Select(s => new StateDto
                {
                    Code = s.Code.ToString(),
                    DisplayMember = s.FullDesc
                })
                .OrderBy(s => s.DisplayMember)
                .ToListAsync();

            return Ok(states);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener provincias");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("lines")]
    public async Task<ActionResult<List<LineDto>>> GetLines()
    {
        try
        {
            var lines = await _context.VLines
                .Select(l => new LineDto
                {
                    Code = l.Code.ToString(),
                    DisplayMember = l.FullDesc
                })
                .OrderBy(l => l.DisplayMember)
                .ToListAsync();

            return Ok(lines);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener líneas de negocio");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("representatives")]
    public async Task<ActionResult<List<RepresentativeDto>>> GetRepresentatives()
    {
        try
        {
            var representatives = await _context.VRepresentatives
                .Select(r => new RepresentativeDto
                {
                    Code = r.Code,
                    DisplayMember = r.DisplayMember
                })
                .OrderBy(r => r.DisplayMember)
                .ToListAsync();

            return Ok(representatives);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener representantes");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("supervisors")]
    public async Task<ActionResult<List<SupervisorDto>>> GetSupervisors()
    {
        try
        {
            var supervisors = await _context.VSupervisors
                .Select(s => new SupervisorDto
                {
                    Code = s.Code.ToString(),
                    DisplayMember = s.DisplayMember ?? string.Empty
                })
                .OrderBy(s => s.DisplayMember)
                .ToListAsync();

            return Ok(supervisors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener supervisores");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("audit-markets")]
    public async Task<ActionResult<List<AuditMarketDto>>> GetAuditMarkets()
    {
        try
        {
            var markets = await _context.VMercadoDeAuditoria
                .Select(m => new AuditMarketDto
                {
                    Code = m.Codigo.ToString(),
                    DisplayMember = m.DisplayMember
                })
                .OrderBy(m => m.DisplayMember)
                .ToListAsync();

            return Ok(markets);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener mercados de auditoría");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("audit-molecules")]
    public async Task<ActionResult<List<AuditMoleculeDto>>> GetAuditMolecules()
    {
        try
        {
            var molecules = await _context.VMoleculaDeAuditoria
                .Select(m => new AuditMoleculeDto
                {
                    Code = m.Marca + "|" + m.Molecula,
                    DisplayMember = m.DisplayMember
                })
                .OrderBy(m => m.DisplayMember)
                .ToListAsync();

            return Ok(molecules);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener moléculas de auditoría");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("audit-products")]
    public async Task<ActionResult<List<AuditProductDto>>> GetAuditProducts()
    {
        try
        {
            var products = await _context.VProductoDeAuditoria
                .Select(p => new AuditProductDto
                {
                    Code = p.Codigo.ToString(),
                    DisplayMember = p.DisplayMember
                })
                .OrderBy(p => p.DisplayMember)
                .ToListAsync();

            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener productos de auditoría");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("materials-stock")]
    public async Task<ActionResult<List<MaterialStockDto>>> GetMaterialsStock([FromQuery] int? importId)
    {
        try
        {
            var query = _context.VMaterialesStocks.AsQueryable();

            if (importId.HasValue)
            {
                query = query.Where(m => m.ImportId == importId.Value);
            }

            var materials = await query
                .Select(m => new MaterialStockDto
                {
                    CodigoSap = m.CodigoSap ?? string.Empty,
                    Description = m.Description,
                    Stock = m.UseStockReal == true ? m.StockReal : m.Stock,
                    Pack = m.Pack
                })
                .OrderBy(m => m.Description)
                .ToListAsync();

            return Ok(materials);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener stock de materiales");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    // Endpoint adicional para obtener todos los catálogos de una vez (útil para inicialización del frontend)
    [HttpGet("all")]
    public async Task<ActionResult<object>> GetAllCatalogs()
    {
        try
        {
            var result = new
            {
                categories = await _context.VCategories.Select(c => new { code = c.Code.ToString(), displayMember = c.FullDesc }).OrderBy(c => c.displayMember).ToListAsync(),
                customerTypes = await _context.VCustomerTypes.Select(ct => new { code = ct.Code.ToString(), displayMember = ct.FullDesc }).OrderBy(ct => ct.displayMember).ToListAsync(),
                specialties = await _context.VSpecialties.Select(s => new { code = s.Code.ToString(), displayMember = s.FullDesc }).OrderBy(s => s.displayMember).ToListAsync(),
                institutionTypes = await _context.VInstitutionTypes.Select(it => new { code = it.Code.ToString(), displayMember = it.FullDesc }).OrderBy(it => it.displayMember).ToListAsync(),
                states = await _context.VStates.Select(s => new { code = s.Code.ToString(), displayMember = s.FullDesc }).OrderBy(s => s.displayMember).ToListAsync(),
                lines = await _context.VLines.Select(l => new { code = l.Code.ToString(), displayMember = l.FullDesc }).OrderBy(l => l.displayMember).ToListAsync(),
                representatives = await _context.VRepresentatives.Select(r => new { code = r.Code, displayMember = r.DisplayMember }).OrderBy(r => r.displayMember).ToListAsync(),
                supervisors = await _context.VSupervisors.Select(s => new { code = s.Code.ToString(), displayMember = s.DisplayMember ?? string.Empty }).OrderBy(s => s.displayMember).ToListAsync(),
                auditMarkets = await _context.VMercadoDeAuditoria.Select(m => new { code = m.Codigo.ToString(), displayMember = m.DisplayMember }).OrderBy(m => m.displayMember).ToListAsync(),
                auditMolecules = await _context.VMoleculaDeAuditoria.Select(m => new { code = m.Marca + "|" + m.Molecula, displayMember = m.DisplayMember }).OrderBy(m => m.displayMember).ToListAsync(),
                auditProducts = await _context.VProductoDeAuditoria.Select(p => new { code = p.Codigo.ToString(), displayMember = p.DisplayMember }).OrderBy(p => p.displayMember).ToListAsync()
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener todos los catálogos");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
