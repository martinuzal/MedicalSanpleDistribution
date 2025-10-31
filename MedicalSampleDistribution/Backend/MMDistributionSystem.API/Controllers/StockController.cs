using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMDistributionSystem.API.Data;
using MMDistributionSystem.API.DTOs;

namespace MMDistributionSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly MaterialPlanningDbContext _context;
    private readonly ILogger<StockController> _logger;

    public StockController(MaterialPlanningDbContext context, ILogger<StockController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<StockListResponse>> GetStocks(
        [FromQuery] string? search,
        [FromQuery] int? importId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = _context.MigrationExistencia
                .Include(e => e.Import)
                .AsQueryable();

            // Filter by search (CodigoSap or MaterialDescription)
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(e =>
                    e.CodigoSap!.Contains(search) ||
                    e.MaterialDescription!.Contains(search));
            }

            // Filter by importId
            if (importId.HasValue)
            {
                query = query.Where(e => e.ImportId == importId.Value);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var stocks = await query
                .OrderBy(e => e.CodigoSap)
                .ThenBy(e => e.ImportId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new StockDto
                {
                    Id = e.Id,
                    CodigoSap = e.CodigoSap ?? string.Empty,
                    MaterialDescription = e.MaterialDescription ?? string.Empty,
                    Stock = e.Stock,
                    StockReal = e.StockReal,
                    StockManual = e.StockManual,
                    Pack = e.Pack,
                    ImportId = e.ImportId,
                    ImportDate = e.Import != null ? e.Import.ImportDate : null,
                    ImportState = e.Import != null ? e.Import.State : null
                })
                .ToListAsync();

            return Ok(new StockListResponse
            {
                Stocks = stocks,
                TotalItems = totalCount,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener stocks");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StockDetailDto>> GetStock(int id)
    {
        try
        {
            var stock = await _context.MigrationExistencia
                .Include(e => e.Import)
                    .ThenInclude(i => i!.User)
                .Where(e => e.Id == id)
                .Select(e => new StockDetailDto
                {
                    Id = e.Id,
                    CodigoSap = e.CodigoSap ?? string.Empty,
                    MaterialDescription = e.MaterialDescription ?? string.Empty,
                    Stock = e.Stock,
                    StockReal = e.StockReal,
                    StockManual = e.StockManual,
                    Pack = e.Pack,
                    ImportId = e.ImportId,
                    CodigoSapLegacy = e.CodigoSapLegacy,
                    ImportDate = e.Import != null ? e.Import.ImportDate : null,
                    ImportState = e.Import != null ? e.Import.State : null,
                    UserName = e.Import != null && e.Import.User != null ? e.Import.User.Name : null
                })
                .FirstOrDefaultAsync();

            if (stock == null)
                return NotFound("Stock no encontrado");

            return Ok(stock);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener stock {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("summary")]
    public async Task<ActionResult<List<StockSummaryDto>>> GetStockSummary(
        [FromQuery] int? importId)
    {
        try
        {
            var query = _context.MigrationExistencia.AsQueryable();

            if (importId.HasValue)
            {
                query = query.Where(e => e.ImportId == importId.Value);
            }

            var summary = await query
                .GroupBy(e => new { e.CodigoSap, e.MaterialDescription })
                .Select(g => new StockSummaryDto
                {
                    CodigoSap = g.Key.CodigoSap ?? string.Empty,
                    MaterialDescription = g.Key.MaterialDescription ?? string.Empty,
                    TotalStock = g.Sum(e => e.Stock ?? 0),
                    TotalStockReal = g.Sum(e => e.StockReal ?? 0),
                    ImportCount = g.Count()
                })
                .OrderBy(s => s.CodigoSap)
                .ToListAsync();

            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener resumen de stock");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}/stock-manual")]
    public async Task<ActionResult> UpdateStockManual(int id, [FromBody] UpdateStockManualDto dto)
    {
        try
        {
            var stock = await _context.MigrationExistencia.FindAsync(id);

            if (stock == null)
                return NotFound("Stock no encontrado");

            stock.StockManual = dto.StockManual;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar stock manual {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("by-material/{codigoSap}")]
    public async Task<ActionResult<List<StockDto>>> GetStockByMaterial(string codigoSap)
    {
        try
        {
            var stocks = await _context.MigrationExistencia
                .Include(e => e.Import)
                .Where(e => e.CodigoSap == codigoSap)
                .OrderBy(e => e.ImportId)
                .Select(e => new StockDto
                {
                    Id = e.Id,
                    CodigoSap = e.CodigoSap ?? string.Empty,
                    MaterialDescription = e.MaterialDescription ?? string.Empty,
                    Stock = e.Stock,
                    StockReal = e.StockReal,
                    StockManual = e.StockManual,
                    Pack = e.Pack,
                    ImportId = e.ImportId,
                    ImportDate = e.Import != null ? e.Import.ImportDate : null,
                    ImportState = e.Import != null ? e.Import.State : null
                })
                .ToListAsync();

            return Ok(stocks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener stock del material {CodigoSap}", codigoSap);
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
