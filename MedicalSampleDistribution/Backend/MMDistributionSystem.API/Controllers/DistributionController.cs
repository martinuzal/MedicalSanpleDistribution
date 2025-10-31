using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMDistributionSystem.API.Data;
using MMDistributionSystem.API.DTOs;

namespace MMDistributionSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DistributionController : ControllerBase
{
    private readonly MaterialPlanningDbContext _context;
    private readonly ILogger<DistributionController> _logger;

    public DistributionController(MaterialPlanningDbContext context, ILogger<DistributionController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<DistributionListResponse>> GetDistributions(
        [FromQuery] int? importId,
        [FromQuery] int? representativeCode,
        [FromQuery] int? supervisorCode,
        [FromQuery] string? materialId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = _context.Distributions
                .Include(d => d.Import)
                .AsQueryable();

            // Filters
            if (importId.HasValue)
            {
                query = query.Where(d => d.ImportId == importId.Value);
            }

            if (representativeCode.HasValue)
            {
                query = query.Where(d => d.RepresentativeCode == representativeCode.Value);
            }

            if (supervisorCode.HasValue)
            {
                query = query.Where(d => d.SupervisorCode == supervisorCode.Value);
            }

            if (!string.IsNullOrEmpty(materialId))
            {
                query = query.Where(d => d.MaterialId.Contains(materialId));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            // Get distributions with representative and supervisor names
            var distributions = await query
                .OrderByDescending(d => d.Import.ImportDate)
                .ThenBy(d => d.RepresentativeCode)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Get representative codes to fetch names
            var representativeCodes = distributions.Select(d => d.RepresentativeCode).Distinct().ToList();
            var representatives = await _context.VRepresentatives
                .Where(r => representativeCodes.Contains(r.Code))
                .ToDictionaryAsync(r => r.Code, r => r.DisplayMember ?? string.Empty);

            // Get supervisor codes to fetch names
            var supervisorCodes = distributions.Select(d => d.SupervisorCode).Distinct().ToList();
            var supervisors = await _context.VSupervisors
                .Where(s => supervisorCodes.Contains(s.Code))
                .ToDictionaryAsync(s => s.Code, s => s.DisplayMember ?? string.Empty);

            // Get material IDs to fetch descriptions
            var materialIds = distributions.Select(d => d.MaterialId).Distinct().ToList();
            var materials = await _context.Materials
                .Where(m => materialIds.Contains(m.CodigoSap))
                .ToDictionaryAsync(m => m.CodigoSap, m => m.Description);

            var distributionsDto = distributions.Select(d => new DistributionDto
            {
                Id = d.Id,
                RepresentativeCode = d.RepresentativeCode,
                RepresentativeName = representatives.GetValueOrDefault(d.RepresentativeCode, "Desconocido"),
                SupervisorCode = d.SupervisorCode,
                SupervisorName = supervisors.GetValueOrDefault(d.SupervisorCode, "Desconocido"),
                MaterialId = d.MaterialId,
                MaterialDescription = materials.GetValueOrDefault(d.MaterialId, "Desconocido"),
                ImportId = d.ImportId,
                ImportDate = d.Import.ImportDate,
                ImportState = d.Import.State,
                LegajoSap = d.LegajoSap,
                Cant = d.Cant
            }).ToList();

            return Ok(new DistributionListResponse
            {
                Distributions = distributionsDto,
                TotalItems = totalCount,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener distribuciones");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("summary")]
    public async Task<ActionResult<List<DistributionSummaryDto>>> GetDistributionSummary(
        [FromQuery] int? importId)
    {
        try
        {
            var query = _context.Distributions.AsQueryable();

            if (importId.HasValue)
            {
                query = query.Where(d => d.ImportId == importId.Value);
            }

            var summary = await query
                .GroupBy(d => d.RepresentativeCode)
                .Select(g => new
                {
                    RepresentativeCode = g.Key,
                    TotalQuantity = g.Sum(d => d.Cant),
                    MaterialsCount = g.Select(d => d.MaterialId).Distinct().Count()
                })
                .ToListAsync();

            // Get representative names
            var representativeCodes = summary.Select(s => s.RepresentativeCode).ToList();
            var representatives = await _context.VRepresentatives
                .Where(r => representativeCodes.Contains(r.Code))
                .ToDictionaryAsync(r => r.Code, r => r.DisplayMember ?? string.Empty);

            var summaryDto = summary.Select(s => new DistributionSummaryDto
            {
                RepresentativeCode = s.RepresentativeCode,
                RepresentativeName = representatives.GetValueOrDefault(s.RepresentativeCode, "Desconocido"),
                TotalQuantity = s.TotalQuantity,
                MaterialsCount = s.MaterialsCount
            }).OrderBy(s => s.RepresentativeName).ToList();

            return Ok(summaryDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener resumen de distribución");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("by-representative/{representativeCode}")]
    public async Task<ActionResult<RepresentativeDistributionDto>> GetDistributionByRepresentative(
        int representativeCode,
        [FromQuery] int? importId)
    {
        try
        {
            var query = _context.Distributions
                .Where(d => d.RepresentativeCode == representativeCode);

            if (importId.HasValue)
            {
                query = query.Where(d => d.ImportId == importId.Value);
            }

            var distributions = await query.ToListAsync();

            if (!distributions.Any())
            {
                return NotFound("No se encontraron distribuciones para este representante");
            }

            // Get representative name
            var representative = await _context.VRepresentatives
                .FirstOrDefaultAsync(r => r.Code == representativeCode);

            // Get material descriptions
            var materialIds = distributions.Select(d => d.MaterialId).Distinct().ToList();
            var materials = await _context.Materials
                .Where(m => materialIds.Contains(m.CodigoSap))
                .ToDictionaryAsync(m => m.CodigoSap, m => m.Description);

            // Group by material
            var materialGroups = distributions
                .GroupBy(d => d.MaterialId)
                .Select(g => new MaterialDistributionDto
                {
                    MaterialId = g.Key,
                    MaterialDescription = materials.GetValueOrDefault(g.Key, "Desconocido"),
                    Quantity = g.Sum(d => d.Cant)
                })
                .OrderBy(m => m.MaterialDescription)
                .ToList();

            var result = new RepresentativeDistributionDto
            {
                RepresentativeCode = representativeCode,
                RepresentativeName = representative?.DisplayMember ?? "Desconocido",
                Materials = materialGroups,
                TotalQuantity = materialGroups.Sum(m => m.Quantity)
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener distribución del representante {RepresentativeCode}", representativeCode);
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
