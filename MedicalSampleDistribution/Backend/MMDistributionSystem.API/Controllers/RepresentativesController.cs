using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMDistributionSystem.API.Data;
using MMDistributionSystem.API.DTOs;

namespace MMDistributionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RepresentativesController : ControllerBase
    {
        private readonly MaterialPlanningDbContext _context;
        private readonly ILogger<RepresentativesController> _logger;

        public RepresentativesController(MaterialPlanningDbContext context, ILogger<RepresentativesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<RepresentativesListDto>> GetRepresentatives(
            [FromQuery] int? regionCode = null,
            [FromQuery] int? districtCode = null,
            [FromQuery] int? managerCode = null,
            [FromQuery] int? businessLineCode = null,
            [FromQuery] string? search = null)
        {
            try
            {
                var representatives = new List<RepresentativeDetailDto>();

                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "SELECT code, lastName, firstName, Description, districtCode, districtDescription, " +
                                         "regionCode, regionDescription, managerCode, managerDescription, status, " +
                                         "regionManagerCode, businessLineCode, businessLineDescription, legacyCode " +
                                         "FROM V_HierarchyView WHERE status = 'A'";

                    await _context.Database.OpenConnectionAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            representatives.Add(new RepresentativeDetailDto
                            {
                                Code = reader.GetInt32(0),
                                LastName = reader.IsDBNull(1) ? null : reader.GetString(1),
                                FirstName = reader.IsDBNull(2) ? null : reader.GetString(2),
                                Description = reader.IsDBNull(3) ? null : reader.GetString(3),
                                DistrictCode = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                                DistrictDescription = reader.IsDBNull(5) ? null : reader.GetString(5),
                                RegionCode = reader.IsDBNull(6) ? null : reader.GetInt32(6),
                                RegionDescription = reader.IsDBNull(7) ? null : reader.GetString(7),
                                ManagerCode = reader.IsDBNull(8) ? null : reader.GetInt32(8),
                                ManagerDescription = reader.IsDBNull(9) ? null : reader.GetString(9),
                                Status = reader.IsDBNull(10) ? null : reader.GetString(10),
                                RegionManagerCode = reader.IsDBNull(11) ? null : reader.GetInt32(11),
                                BusinessLineCode = reader.IsDBNull(12) ? null : reader.GetInt32(12),
                                BusinessLineDescription = reader.IsDBNull(13) ? null : reader.GetString(13),
                                LegacyCode = reader.IsDBNull(14) ? null : reader.GetString(14)
                            });
                        }
                    }
                }

                // Apply filters
                var filtered = representatives.AsEnumerable();

                if (regionCode.HasValue)
                {
                    filtered = filtered.Where(r => r.RegionCode == regionCode.Value);
                }

                if (districtCode.HasValue)
                {
                    filtered = filtered.Where(r => r.DistrictCode == districtCode.Value);
                }

                if (managerCode.HasValue)
                {
                    filtered = filtered.Where(r => r.ManagerCode == managerCode.Value);
                }

                if (businessLineCode.HasValue)
                {
                    filtered = filtered.Where(r => r.BusinessLineCode == businessLineCode.Value);
                }

                if (!string.IsNullOrWhiteSpace(search))
                {
                    var searchLower = search.ToLower();
                    filtered = filtered.Where(r =>
                        (r.FirstName != null && r.FirstName.ToLower().Contains(searchLower)) ||
                        (r.LastName != null && r.LastName.ToLower().Contains(searchLower)) ||
                        (r.Description != null && r.Description.ToLower().Contains(searchLower)) ||
                        (r.LegacyCode != null && r.LegacyCode.ToLower().Contains(searchLower)) ||
                        r.Code.ToString().Contains(searchLower)
                    );
                }

                var result = filtered.ToList();

                return Ok(new RepresentativesListDto
                {
                    Representatives = result,
                    TotalCount = result.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading representatives");
                return StatusCode(500, "Error loading representatives");
            }
        }

        [HttpGet("filters")]
        public async Task<ActionResult<RepresentativeFiltersDto>> GetFilters()
        {
            try
            {
                var filters = new RepresentativeFiltersDto();

                using (var command = _context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = @"
                        SELECT DISTINCT regionCode, regionDescription
                        FROM V_HierarchyView
                        WHERE status = 'A' AND regionCode IS NOT NULL AND regionDescription IS NOT NULL
                        ORDER BY regionDescription;

                        SELECT DISTINCT districtCode, districtDescription
                        FROM V_HierarchyView
                        WHERE status = 'A' AND districtCode IS NOT NULL AND districtDescription IS NOT NULL
                        ORDER BY districtDescription;

                        SELECT DISTINCT managerCode, managerDescription
                        FROM V_HierarchyView
                        WHERE status = 'A' AND managerCode IS NOT NULL AND managerDescription IS NOT NULL
                        ORDER BY managerDescription;

                        SELECT DISTINCT businessLineCode, businessLineDescription
                        FROM V_HierarchyView
                        WHERE status = 'A' AND businessLineCode IS NOT NULL AND businessLineDescription IS NOT NULL
                        ORDER BY businessLineDescription;
                    ";

                    await _context.Database.OpenConnectionAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        // Read regions
                        while (await reader.ReadAsync())
                        {
                            filters.Regions.Add(new RegionFilterDto
                            {
                                Code = reader.GetInt32(0),
                                Description = reader.GetString(1)
                            });
                        }

                        // Read districts
                        await reader.NextResultAsync();
                        while (await reader.ReadAsync())
                        {
                            filters.Districts.Add(new DistrictFilterDto
                            {
                                Code = reader.GetInt32(0),
                                Description = reader.GetString(1)
                            });
                        }

                        // Read managers
                        await reader.NextResultAsync();
                        while (await reader.ReadAsync())
                        {
                            filters.Managers.Add(new ManagerFilterDto
                            {
                                Code = reader.GetInt32(0),
                                Description = reader.GetString(1)
                            });
                        }

                        // Read business lines
                        await reader.NextResultAsync();
                        while (await reader.ReadAsync())
                        {
                            filters.BusinessLines.Add(new BusinessLineFilterDto
                            {
                                Code = reader.GetInt32(0),
                                Description = reader.GetString(1)
                            });
                        }
                    }
                }

                return Ok(filters);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading filters");
                return StatusCode(500, "Error loading filters");
            }
        }
    }
}
