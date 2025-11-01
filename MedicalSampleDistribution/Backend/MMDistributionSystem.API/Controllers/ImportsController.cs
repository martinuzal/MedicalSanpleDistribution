using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMDistributionSystem.API.Data;
using MMDistributionSystem.API.DTOs;
using MMDistributionSystem.API.Models;

namespace MMDistributionSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportsController : ControllerBase
{
    private readonly MaterialPlanningDbContext _context;
    private readonly ILogger<ImportsController> _logger;

    public ImportsController(MaterialPlanningDbContext context, ILogger<ImportsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<ImportListResponse>> GetImports(
        [FromQuery] string? state,
        [FromQuery] DateTime? fromDate,
        [FromQuery] DateTime? toDate,
        [FromQuery] bool? hasDistribution,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var query = _context.Imports
                .Include(i => i.User)
                .Where(i => i.FechaBaja == null);

            if (!string.IsNullOrEmpty(state))
            {
                query = query.Where(i => i.State == state);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(i => i.ImportDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(i => i.ImportDate <= toDate.Value);
            }

            if (hasDistribution.HasValue && hasDistribution.Value)
            {
                query = query.Where(i => _context.Distributions.Any(d => d.ImportId == i.Id));
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var imports = await query
                .OrderByDescending(i => i.ImportDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new ImportDto
                {
                    Id = i.Id,
                    UserId = i.UserId,
                    UserName = i.User.Name,
                    ImportDate = i.ImportDate,
                    State = i.State,
                    FileNameExistencia = i.FileNameExistencia,
                    FileNameAsignacion = i.FileNameAsignacion,
                    FileBase = i.FileBase,
                    FechaAlta = i.FechaAlta,
                    UsuarioAlta = i.UsuarioAlta,
                    FechaModificacion = i.FechaModificacion,
                    UsuarioModificacion = i.UsuarioModificacion
                })
                .ToListAsync();

            return Ok(new ImportListResponse
            {
                Imports = imports,
                TotalItems = totalCount,
                TotalPages = totalPages,
                CurrentPage = pageNumber
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener marcaciones");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ImportDto>> GetImport(int id)
    {
        try
        {
            var import = await _context.Imports
                .Include(i => i.User)
                .Where(i => i.Id == id && i.FechaBaja == null)
                .Select(i => new ImportDto
                {
                    Id = i.Id,
                    UserId = i.UserId,
                    UserName = i.User.Name,
                    ImportDate = i.ImportDate,
                    State = i.State,
                    FileNameExistencia = i.FileNameExistencia,
                    FileNameAsignacion = i.FileNameAsignacion,
                    FileBase = i.FileBase,
                    FechaAlta = i.FechaAlta,
                    UsuarioAlta = i.UsuarioAlta,
                    FechaModificacion = i.FechaModificacion,
                    UsuarioModificacion = i.UsuarioModificacion
                })
                .FirstOrDefaultAsync();

            if (import == null)
                return NotFound("Marcación no encontrada");

            return Ok(import);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener marcación {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPost]
    public async Task<ActionResult<ImportDto>> CreateImport([FromBody] CreateImportDto dto)
    {
        try
        {
            var import = new Import
            {
                UserId = dto.UserId,
                ImportDate = dto.ImportDate,
                State = dto.State ?? "Draft",
                FileNameExistencia = dto.FileNameExistencia,
                FileNameAsignacion = dto.FileNameAsignacion,
                FileBase = dto.FileBase,
                FechaAlta = DateTime.Now,
                UsuarioAlta = dto.UsuarioAlta,
                FechaModificacion = DateTime.Now,
                UsuarioModificacion = dto.UsuarioAlta
            };

            _context.Imports.Add(import);
            await _context.SaveChangesAsync();

            var createdImport = await _context.Imports
                .Include(i => i.User)
                .Where(i => i.Id == import.Id)
                .Select(i => new ImportDto
                {
                    Id = i.Id,
                    UserId = i.UserId,
                    UserName = i.User.Name,
                    ImportDate = i.ImportDate,
                    State = i.State,
                    FileNameExistencia = i.FileNameExistencia,
                    FileNameAsignacion = i.FileNameAsignacion,
                    FileBase = i.FileBase,
                    FechaAlta = i.FechaAlta,
                    UsuarioAlta = i.UsuarioAlta,
                    FechaModificacion = i.FechaModificacion,
                    UsuarioModificacion = i.UsuarioModificacion
                })
                .FirstAsync();

            return CreatedAtAction(nameof(GetImport), new { id = import.Id }, createdImport);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear marcación");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ImportDto>> UpdateImport(int id, [FromBody] UpdateImportDto dto)
    {
        try
        {
            var import = await _context.Imports.FindAsync(id);
            if (import == null || import.FechaBaja != null)
                return NotFound("Marcación no encontrada");

            if (!string.IsNullOrEmpty(dto.State))
                import.State = dto.State;

            if (!string.IsNullOrEmpty(dto.FileNameExistencia))
                import.FileNameExistencia = dto.FileNameExistencia;

            if (!string.IsNullOrEmpty(dto.FileNameAsignacion))
                import.FileNameAsignacion = dto.FileNameAsignacion;

            if (!string.IsNullOrEmpty(dto.FileBase))
                import.FileBase = dto.FileBase;

            import.FechaModificacion = DateTime.Now;
            import.UsuarioModificacion = dto.UsuarioModificacion;

            await _context.SaveChangesAsync();

            var updatedImport = await _context.Imports
                .Include(i => i.User)
                .Where(i => i.Id == id)
                .Select(i => new ImportDto
                {
                    Id = i.Id,
                    UserId = i.UserId,
                    UserName = i.User.Name,
                    ImportDate = i.ImportDate,
                    State = i.State,
                    FileNameExistencia = i.FileNameExistencia,
                    FileNameAsignacion = i.FileNameAsignacion,
                    FileBase = i.FileBase,
                    FechaAlta = i.FechaAlta,
                    UsuarioAlta = i.UsuarioAlta,
                    FechaModificacion = i.FechaModificacion,
                    UsuarioModificacion = i.UsuarioModificacion
                })
                .FirstAsync();

            return Ok(updatedImport);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar marcación {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteImport(int id, [FromQuery] string usuario)
    {
        try
        {
            var import = await _context.Imports.FindAsync(id);
            if (import == null || import.FechaBaja != null)
                return NotFound("Marcación no encontrada");

            import.FechaBaja = DateTime.Now;
            import.UsuarioBaja = usuario;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar marcación {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}/detail")]
    public async Task<ActionResult<ImportDetailDto>> GetImportDetail(int id)
    {
        try
        {
            // Get import
            var import = await _context.Imports
                .Include(i => i.User)
                .Where(i => i.Id == id && i.FechaBaja == null)
                .Select(i => new ImportDto
                {
                    Id = i.Id,
                    UserId = i.UserId,
                    UserName = i.User != null ? i.User.Name : null,
                    ImportDate = i.ImportDate,
                    State = i.State,
                    FileNameExistencia = i.FileNameExistencia,
                    FileNameAsignacion = i.FileNameAsignacion,
                    FileBase = i.FileBase,
                    FechaAlta = i.FechaAlta,
                    UsuarioAlta = i.UsuarioAlta,
                    FechaModificacion = i.FechaModificacion,
                    UsuarioModificacion = i.UsuarioModificacion
                })
                .FirstOrDefaultAsync();

            if (import == null)
                return NotFound("Marcación no encontrada");

            // Get criteria (MigrationConfiguration)
            var criteria = await _context.MigrationConfigurations
                .Where(c => c.ImportId == id && c.FechaBaja == null)
                .Select(c => new ConfigurationCriteriaDto
                {
                    Id = c.Id,
                    TipoCliente = c.TipoCliente,
                    Campania = c.Campania,
                    LugarVisita = c.LugarVisita,
                    Institucion = c.Institucion,
                    Especialidad = c.Especialidad,
                    Edad = c.Edad,
                    Sexo = c.Sexo,
                    EspecialidadSec = c.EspecialidadSec,
                    EspecialidadCartera = c.EspecialidadCartera,
                    Categoria = c.Categoria,
                    Tarea = c.Tarea,
                    Frecuencia = c.Frecuencia,
                    Planificacion = c.Planificacion,
                    Provincia = c.Provincia,
                    Tratamiento = c.Tratamiento,
                    ObjetosEntregados = c.ObjetosEntregados,
                    Linea = c.Linea,
                    AuditCategoria = c.AuditCategoria,
                    AuditMercado = c.AuditMercado,
                    AuditProducto = c.AuditProducto,
                    AuditMolecula = c.AuditMolecula,
                    PorcenDeAplic = c.PorcenDeAplic,
                    CountPreview = c.CountPreview,
                    RowId = c.RowId,
                    UsuarioAlta = c.UsuarioAlta
                })
                .ToListAsync();

            // Get direct assignments (MigrationDirect)
            var directAssignments = await _context.MigrationDirects
                .Where(d => d.ImportId == id && d.FechaBaja == null)
                .Select(d => new DirectAssignmentDto
                {
                    Id = d.Id,
                    Supervisor = d.Supervisor,
                    LegajoSupervisor = d.LegajoSupervisor,
                    Representante = d.Representante,
                    LegajoRepresentante = d.LegajoRepresentante,
                    Excluded = d.Excluded,
                    RowId = d.RowId
                })
                .ToListAsync();

            // Get materials configuration (MigrationMaterial)
            var materials = await _context.MigrationMaterials
                .Where(m => m.ImportId == id)
                .ToListAsync();

            // Get stock for materials - join with MigrationMaterial to check UseStockReal
            var materialCodes = materials.Select(m => m.CodigoSap).ToList();
            var materialDict = materials.ToDictionary(m => m.CodigoSap);

            var stocks = await _context.MigrationExistencia
                .Where(e => e.ImportId == id && materialCodes.Contains(e.CodigoSap))
                .GroupBy(e => e.CodigoSap)
                .Select(g => new
                {
                    CodigoSap = g.Key,
                    TotalStock = g.Sum(e => e.Stock) ?? 0,
                    TotalStockReal = g.Sum(e => e.StockReal) ?? 0
                })
                .ToDictionaryAsync(s => s.CodigoSap ?? string.Empty);

            var materialsDto = materials.Select(m => new MaterialConfigurationDto
            {
                Id = m.Id,
                CodigoSap = m.CodigoSap,
                Description = m.Description,
                Pack = m.Pack,
                MaxStock = m.MaxStock,
                MinStock = m.MinStock,
                Maestro = m.Maestro,
                UseStockReal = m.UseStockReal,
                StockManual = m.StockManual,
                CurrentStock = stocks.TryGetValue(m.CodigoSap, out var stockInfo)
                    ? (m.UseStockReal == true ? stockInfo.TotalStockReal : stockInfo.TotalStock)
                    : 0
            }).ToList();

            // Calculate statistics
            var statistics = new ImportStatisticsDto
            {
                TotalCriteria = criteria.Count,
                TotalDirectAssignments = directAssignments.Count,
                TotalMaterials = materialsDto.Count,
                TotalStock = materialsDto.Sum(m => m.CurrentStock ?? 0),
                MaterialsWithMinMax = materialsDto.Count(m => m.MinStock.HasValue && m.MaxStock.HasValue)
            };

            var result = new ImportDetailDto
            {
                Import = import,
                Criteria = criteria,
                DirectAssignments = directAssignments,
                Materials = materialsDto,
                Statistics = statistics
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener detalle de marcación {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}/coverage-dashboard")]
    public async Task<ActionResult<CoverageDashboardDto>> GetCoverageDashboard(int id)
    {
        try
        {
            // Verify import exists
            var importExists = await _context.Imports
                .AnyAsync(i => i.Id == id && i.FechaBaja == null);

            if (!importExists)
            {
                return NotFound($"Marcación con ID {id} no encontrada");
            }

            // Log connection string info (without sensitive data)
            var connectionString = _context.Database.GetDbConnection().ConnectionString;
            var dbName = connectionString.Contains("Database=")
                ? connectionString.Substring(connectionString.IndexOf("Database=") + 9).Split(';')[0]
                : "Unknown";
            var serverName = connectionString.Contains("Server=")
                ? connectionString.Substring(connectionString.IndexOf("Server=") + 7).Split(';')[0]
                : "Unknown";

            _logger.LogInformation($"Executing stored procedure on Server: {serverName}, Database: {dbName}");

            // Execute stored procedure manually to handle mixed Int32/Double types
            var materials = new List<MaterialCoverageDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "[rptCoberturaXmaterial_dsz]";
                command.CommandType = System.Data.CommandType.StoredProcedure;
                var parameter = command.CreateParameter();
                parameter.ParameterName = "@ImportId";
                parameter.Value = id;
                command.Parameters.Add(parameter);

                _logger.LogInformation($"Attempting to execute SP: {command.CommandText} with ImportId: {id}");

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        materials.Add(new MaterialCoverageDto
                        {
                            MaterialId = reader.IsDBNull(0) ? string.Empty : reader.GetString(0),
                            CantXCriterioSegmentado = reader.IsDBNull(1) ? null : Convert.ToDouble(reader.GetValue(1)),
                            CantidadCrierioDirecto = reader.IsDBNull(2) ? null : Convert.ToDouble(reader.GetValue(2)),
                            CantTotal = reader.IsDBNull(3) ? null : Convert.ToDouble(reader.GetValue(3)),
                            CantAjustada = reader.IsDBNull(4) ? null : Convert.ToDouble(reader.GetValue(4)),
                            CantDifPackJefe = reader.IsDBNull(5) ? null : Convert.ToDouble(reader.GetValue(5)),
                            CantEnviar = reader.IsDBNull(6) ? null : Convert.ToDouble(reader.GetValue(6)),
                            PorcCobert = reader.IsDBNull(7) ? null : Convert.ToDecimal(reader.GetValue(7)),
                            Stock = reader.IsDBNull(8) ? null : Convert.ToDouble(reader.GetValue(8)),
                            Pack = reader.IsDBNull(9) ? null : Convert.ToDouble(reader.GetValue(9)),
                            MinStock = reader.IsDBNull(10) ? null : Convert.ToDouble(reader.GetValue(10)),
                            MaxStock = reader.IsDBNull(11) ? null : Convert.ToDouble(reader.GetValue(11)),
                            PorcCobertStockMin = reader.IsDBNull(12) ? null : Convert.ToDecimal(reader.GetValue(12)),
                            CantEnviarDelegaciones = reader.IsDBNull(13) ? null : Convert.ToDouble(reader.GetValue(13)),
                            CantAjustadaCriterio = reader.IsDBNull(14) ? null : Convert.ToDouble(reader.GetValue(14)),
                            CantAjustadaDirecta = reader.IsDBNull(15) ? null : Convert.ToDouble(reader.GetValue(15)),
                            CantAjustadaTotal = reader.IsDBNull(16) ? null : Convert.ToDouble(reader.GetValue(16)),
                            CantTotalEnviar = reader.IsDBNull(17) ? null : Convert.ToDouble(reader.GetValue(17)),
                            CantTotalAPM = reader.IsDBNull(18) ? null : Convert.ToDouble(reader.GetValue(18)),
                            Semaforo = reader.IsDBNull(19) ? null : reader.GetString(19)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            // Calculate summary statistics
            var summary = new CoverageSummaryDto
            {
                TotalMaterials = materials.Count,
                TotalStock = materials.Sum(m => m.Stock ?? 0),
                TotalCantEnviar = materials.Sum(m => m.CantEnviar ?? 0),
                AverageCoverage = materials.Any(m => m.PorcCobert.HasValue)
                    ? materials.Where(m => m.PorcCobert.HasValue).Average(m => m.PorcCobert!.Value)
                    : 0,
                MaterialsWithNegativeStock = materials.Count(m => (m.CantEnviar ?? 0) < 0),
                MaterialsWithinRange = materials.Count(m =>
                    m.MinStock.HasValue && m.MaxStock.HasValue &&
                    m.CantEnviar >= m.MinStock && m.CantEnviar <= m.MaxStock)
            };

            var result = new CoverageDashboardDto
            {
                ImportId = id,
                Materials = materials,
                Summary = summary
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener dashboard de cobertura para marcación {Id}", id);

            // Add more specific error details for stored procedure issues
            if (ex.Message.Contains("stored procedure"))
            {
                _logger.LogError($"Stored Procedure Error Details: {ex.Message}");
                _logger.LogError($"SP Name attempted: dbo.rptCoberturaXmaterial_dsz");
                _logger.LogError($"Connection State: {_context.Database.GetDbConnection().State}");
                return StatusCode(500, $"Error al ejecutar stored procedure: {ex.Message}");
            }

            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}/material-detail/{materialId}")]
    public async Task<ActionResult<MaterialDetailDashboardDto>> GetMaterialDetailDashboard(int id, string materialId)
    {
        try
        {
            // Verify import exists
            var importExists = await _context.Imports
                .AnyAsync(i => i.Id == id && i.FechaBaja == null);

            if (!importExists)
            {
                return NotFound($"Marcación con ID {id} no encontrada");
            }

            // Log connection info
            var connectionString = _context.Database.GetDbConnection().ConnectionString;
            var dbName = connectionString.Contains("Database=")
                ? connectionString.Substring(connectionString.IndexOf("Database=") + 9).Split(';')[0]
                : "Unknown";
            var serverName = connectionString.Contains("Server=")
                ? connectionString.Substring(connectionString.IndexOf("Server=") + 7).Split(';')[0]
                : "Unknown";

            _logger.LogInformation($"Executing material detail SP on Server: {serverName}, Database: {dbName}");

            // Execute stored procedure
            var details = new List<MaterialDetailByRepSupDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "[rptCoberturaXmaterialxRepSup_DEVSZ]";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                var importIdParam = command.CreateParameter();
                importIdParam.ParameterName = "@importId";
                importIdParam.Value = id;
                command.Parameters.Add(importIdParam);

                var materialIdParam = command.CreateParameter();
                materialIdParam.ParameterName = "@MaterialId";
                materialIdParam.Value = materialId;
                command.Parameters.Add(materialIdParam);

                _logger.LogInformation($"Executing SP: {command.CommandText} with ImportId: {id}, MaterialId: {materialId}");

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        details.Add(new MaterialDetailByRepSupDto
                        {
                            Supervisor = reader.IsDBNull(0) ? null : reader.GetString(0),
                            RepresentativeCode = reader.IsDBNull(1) ? null : reader.GetString(1),
                            MaterialId = reader.IsDBNull(2) ? null : reader.GetString(2),
                            CantEnviar = reader.IsDBNull(3) ? null : Convert.ToDouble(reader.GetValue(3)),
                            IsJefe = reader.IsDBNull(4) ? null : Convert.ToInt32(reader.GetValue(4))
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            // Get material name from coverage dashboard SP
            string materialName = materialId;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "[rptCoberturaXmaterial_dsz]";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                var importIdParam = command.CreateParameter();
                importIdParam.ParameterName = "@importId";
                importIdParam.Value = id;
                command.Parameters.Add(importIdParam);

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var matId = reader.IsDBNull(0) ? null : reader.GetString(0);
                        // Check if this is our material (compare the code part)
                        if (matId != null && matId.Contains($"[{materialId}]"))
                        {
                            materialName = matId;
                            break;
                        }
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            // Calculate summary
            var summary = new MaterialDetailSummaryDto
            {
                TotalRecords = details.Count,
                TotalRepresentantes = details.Where(d => d.IsJefe == 0).Select(d => d.RepresentativeCode).Distinct().Count(),
                TotalSupervisores = details.Select(d => d.Supervisor).Distinct().Count(),
                TotalCantEnviar = details.Sum(d => d.CantEnviar ?? 0),
                TotalJefes = details.Where(d => d.IsJefe == 1).Select(d => d.RepresentativeCode).Distinct().Count(),
                CantEnviarJefes = details.Where(d => d.IsJefe == 1).Sum(d => d.CantEnviar ?? 0),
                CantEnviarRepresentantes = details.Where(d => d.IsJefe == 0).Sum(d => d.CantEnviar ?? 0)
            };

            var result = new MaterialDetailDashboardDto
            {
                ImportId = id,
                MaterialId = materialId,
                MaterialName = materialName,
                Details = details,
                Summary = summary
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener dashboard de detalle para material {MaterialId} en marcación {Id}", materialId, id);

            if (ex.Message.Contains("stored procedure"))
            {
                _logger.LogError($"Stored Procedure Error Details: {ex.Message}");
                _logger.LogError($"SP Name attempted: rptCoberturaXmaterialxRepSup_DEVSZ");
                return StatusCode(500, $"Error al ejecutar stored procedure: {ex.Message}");
            }

            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}/general-distribution-dashboard")]
    public async Task<ActionResult<MaterialDetailDashboardDto>> GetGeneralDistributionDashboard(int id)
    {
        try
        {
            // Verify import exists
            var importExists = await _context.Imports
                .AnyAsync(i => i.Id == id && i.FechaBaja == null);

            if (!importExists)
            {
                return NotFound($"Marcación con ID {id} no encontrada");
            }

            // Log connection info
            var connectionString = _context.Database.GetDbConnection().ConnectionString;
            var dbName = connectionString.Contains("Database=")
                ? connectionString.Substring(connectionString.IndexOf("Database=") + 9).Split(';')[0]
                : "Unknown";
            var serverName = connectionString.Contains("Server=")
                ? connectionString.Substring(connectionString.IndexOf("Server=") + 7).Split(';')[0]
                : "Unknown";

            _logger.LogInformation($"Executing general distribution SP on Server: {serverName}, Database: {dbName}");

            // Execute stored procedure with empty materialId to get all data
            var details = new List<MaterialDetailByRepSupDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "[rptCoberturaXmaterialxRepSup_DEVSZ]";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                var importIdParam = command.CreateParameter();
                importIdParam.ParameterName = "@importId";
                importIdParam.Value = id;
                command.Parameters.Add(importIdParam);

                var materialIdParam = command.CreateParameter();
                materialIdParam.ParameterName = "@MaterialId";
                materialIdParam.Value = "";
                command.Parameters.Add(materialIdParam);

                _logger.LogInformation($"Executing SP: {command.CommandText} with ImportId: {id}, MaterialId: '' (all materials)");

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        details.Add(new MaterialDetailByRepSupDto
                        {
                            Supervisor = reader.IsDBNull(0) ? null : reader.GetString(0),
                            RepresentativeCode = reader.IsDBNull(1) ? null : reader.GetString(1),
                            MaterialId = reader.IsDBNull(2) ? null : reader.GetString(2),
                            CantEnviar = reader.IsDBNull(3) ? null : reader.GetDouble(3),
                            IsJefe = reader.IsDBNull(4) ? null : reader.GetInt32(4)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            // Calculate summary
            var summary = new MaterialDetailSummaryDto
            {
                TotalRecords = details.Count,
                TotalRepresentantes = details.Where(d => d.IsJefe == 0).Select(d => d.RepresentativeCode).Distinct().Count(),
                TotalSupervisores = details.Select(d => d.Supervisor).Distinct().Count(),
                TotalCantEnviar = details.Sum(d => d.CantEnviar ?? 0),
                TotalJefes = details.Where(d => d.IsJefe == 1).Select(d => d.RepresentativeCode).Distinct().Count(),
                CantEnviarJefes = details.Where(d => d.IsJefe == 1).Sum(d => d.CantEnviar ?? 0),
                CantEnviarRepresentantes = details.Where(d => d.IsJefe == 0).Sum(d => d.CantEnviar ?? 0)
            };

            var result = new MaterialDetailDashboardDto
            {
                ImportId = id,
                MaterialId = "",
                MaterialName = "Todos los materiales",
                Details = details,
                Summary = summary
            };

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener dashboard de distribución general para marcación {Id}", id);

            if (ex.Message.Contains("stored procedure"))
            {
                _logger.LogError($"Stored Procedure Error Details: {ex.Message}");
                _logger.LogError($"SP Name attempted: rptCoberturaXmaterialxRepSup_DEVSZ");
                return StatusCode(500, $"Error al ejecutar stored procedure: {ex.Message}");
            }

            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}/criterios")]
    public async Task<ActionResult<CriteriosListDto>> GetCriterios(int id)
    {
        try
        {
            // Verify import exists
            var importExists = await _context.Imports
                .AnyAsync(i => i.Id == id && i.FechaBaja == null);

            if (!importExists)
            {
                return NotFound($"Marcación con ID {id} no encontrada");
            }

            _logger.LogInformation($"Executing rpt_criterios SP for ImportId: {id}");

            // Execute stored procedure
            var criterios = new List<CriterioDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "[rpt_criterios]";
                command.CommandType = System.Data.CommandType.StoredProcedure;

                var importIdParam = command.CreateParameter();
                importIdParam.ParameterName = "@importId";
                importIdParam.Value = id;
                command.Parameters.Add(importIdParam);

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        criterios.Add(new CriterioDto
                        {
                            Criterio = reader.IsDBNull(0) ? null : reader.GetString(0),
                            Material = reader.IsDBNull(1) ? null : reader.GetString(1),
                            MaterialId = reader.IsDBNull(2) ? null : reader.GetString(2)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            var result = new CriteriosListDto
            {
                ImportId = id,
                Criterios = criterios
            };

            _logger.LogInformation($"Retrieved {criterios.Count} criterios records");
            if (criterios.Count > 0)
            {
                _logger.LogInformation($"Sample criterio: Criterio={criterios[0].Criterio}, Material={criterios[0].Material}, MaterialId={criterios[0].MaterialId}");
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener criterios para marcación {Id}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{importId}/criteria/{criteriaId}/materials")]
    public async Task<ActionResult<List<CriteriaMaterialDto>>> GetCriteriaMaterials(int importId, int criteriaId)
    {
        try
        {
            _logger.LogInformation($"Getting materials for ImportId: {importId}, CriteriaId: {criteriaId}");

            var materials = new List<CriteriaMaterialDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"
                    SELECT DISTINCT
                        MigrationConfiguration.RowId,
                        Material.CodigoSap,
                        Material.Description,
                        ISNULL(MigrationAssignment.Value, 0) + MigrationAssignment.Direct AS Quantity
                    FROM MigrationConfiguration
                    INNER JOIN MigrationAssignment ON
                        MigrationAssignment.ImportId = MigrationConfiguration.ImportId AND
                        MigrationAssignment.RowId = MigrationConfiguration.RowId
                    INNER JOIN Material ON Material.CodigoSap = MigrationAssignment.CodigoSap
                    WHERE MigrationConfiguration.ImportId = @importId
                        AND MigrationConfiguration.RowId = @criteriaId
                        AND (ISNULL(MigrationAssignment.Value, 0) <> 0 OR MigrationAssignment.Direct <> 0)";
                command.CommandType = System.Data.CommandType.Text;

                var importIdParam = command.CreateParameter();
                importIdParam.ParameterName = "@importId";
                importIdParam.Value = importId;
                command.Parameters.Add(importIdParam);

                var criteriaIdParam = command.CreateParameter();
                criteriaIdParam.ParameterName = "@criteriaId";
                criteriaIdParam.Value = criteriaId;
                command.Parameters.Add(criteriaIdParam);

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        materials.Add(new CriteriaMaterialDto
                        {
                            RowId = reader.GetInt32(0),
                            CodigoSap = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                            Description = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                            Quantity = reader.IsDBNull(3) ? 0 : reader.GetInt32(3)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            _logger.LogInformation($"Retrieved {materials.Count} materials for criteria {criteriaId}");

            return Ok(materials);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener materiales para criterio {CriteriaId} en marcación {ImportId}", criteriaId, importId);
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
