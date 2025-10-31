using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMDistributionSystem.API.Data;
using MMDistributionSystem.API.DTOs;

namespace MMDistributionSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialsController : ControllerBase
{
    private readonly MaterialPlanningDbContext _context;
    private readonly ILogger<MaterialsController> _logger;

    public MaterialsController(MaterialPlanningDbContext context, ILogger<MaterialsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<MaterialListResponse>> GetMaterials(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] int? importId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = _context.Materials.AsQueryable();

            // Filter by search (CodigoSap or Description)
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(m =>
                    m.CodigoSap.Contains(search) ||
                    m.Description.Contains(search));
            }

            // Filter by status
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(m => m.Status == status);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var materials = await query
                .OrderBy(m => m.Description)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get stock information for these materials
            var materialCodes = materials.Select(m => m.CodigoSap).ToList();

            var stockQuery = _context.VMaterialesStocks
                .Where(s => materialCodes.Contains(s.CodigoSap));

            if (importId.HasValue)
            {
                stockQuery = stockQuery.Where(s => s.ImportId == importId.Value);
            }

            var stocks = await stockQuery
                .GroupBy(s => s.CodigoSap)
                .Select(g => new
                {
                    CodigoSap = g.Key,
                    Stock = g.Sum(s => s.UseStockReal == true ? s.StockReal : s.Stock),
                    Pack = g.Max(s => s.Pack)
                })
                .ToDictionaryAsync(s => s.CodigoSap ?? string.Empty);

            var materialsDto = materials.Select(m => new MaterialDto
            {
                Id = m.Id,
                CodigoSap = m.CodigoSap,
                Description = m.Description,
                Status = m.Status,
                CurrentStock = stocks.ContainsKey(m.CodigoSap) ? stocks[m.CodigoSap].Stock : null,
                Pack = stocks.ContainsKey(m.CodigoSap) ? stocks[m.CodigoSap].Pack : null
            }).ToList();

            return Ok(new MaterialListResponse
            {
                Materials = materialsDto,
                TotalItems = totalCount,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener materiales");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MaterialDetailDto>> GetMaterial(int id)
    {
        try
        {
            var material = await _context.Materials
                .Where(m => m.Id == id)
                .FirstOrDefaultAsync();

            if (material == null)
                return NotFound("Material no encontrado");

            // Get all stock information for this material across all imports
            var stockByImport = await _context.VMaterialesStocks
                .Where(s => s.CodigoSap == material.CodigoSap)
                .Select(s => new MaterialStockInfo
                {
                    ImportId = s.ImportId,
                    Stock = s.Stock,
                    StockReal = s.StockReal,
                    Pack = s.Pack,
                    MaxStock = s.MaxStock,
                    MinStock = s.MinStock,
                    UseStockReal = s.UseStockReal,
                    StockManual = s.StockManual
                })
                .ToListAsync();

            var materialDetail = new MaterialDetailDto
            {
                Id = material.Id,
                CodigoSap = material.CodigoSap,
                Description = material.Description,
                Status = material.Status,
                StockByImport = stockByImport.Any() ? stockByImport : null
            };

            return Ok(materialDetail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener material {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("by-codigo/{codigoSap}")]
    public async Task<ActionResult<MaterialDetailDto>> GetMaterialByCodigoSap(string codigoSap)
    {
        try
        {
            var material = await _context.Materials
                .Where(m => m.CodigoSap == codigoSap)
                .FirstOrDefaultAsync();

            if (material == null)
                return NotFound("Material no encontrado");

            // Get all stock information for this material across all imports
            var stockByImport = await _context.VMaterialesStocks
                .Where(s => s.CodigoSap == material.CodigoSap)
                .Select(s => new MaterialStockInfo
                {
                    ImportId = s.ImportId,
                    Stock = s.Stock,
                    StockReal = s.StockReal,
                    Pack = s.Pack,
                    MaxStock = s.MaxStock,
                    MinStock = s.MinStock,
                    UseStockReal = s.UseStockReal,
                    StockManual = s.StockManual
                })
                .ToListAsync();

            var materialDetail = new MaterialDetailDto
            {
                Id = material.Id,
                CodigoSap = material.CodigoSap,
                Description = material.Description,
                Status = material.Status,
                StockByImport = stockByImport.Any() ? stockByImport : null
            };

            return Ok(materialDetail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener material {CodigoSap}", codigoSap);
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
