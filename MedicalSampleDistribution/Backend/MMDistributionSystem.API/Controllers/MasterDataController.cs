using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MMDistributionSystem.API.Data;

namespace MMDistributionSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MasterDataController : ControllerBase
{
    private readonly MaterialPlanningDbContext _context;
    private readonly ILogger<MasterDataController> _logger;

    public MasterDataController(MaterialPlanningDbContext context, ILogger<MasterDataController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("specialties")]
    public async Task<ActionResult<List<MasterDataDto>>> GetSpecialties()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT code, FullDesc FROM V_Specialty ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener especialidades");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("customer-types")]
    public async Task<ActionResult<List<MasterDataDto>>> GetCustomerTypes()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT code, FullDesc FROM V_CustomerType ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tipos de cliente");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("institution-types")]
    public async Task<ActionResult<List<MasterDataDto>>> GetInstitutionTypes()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT code, FullDesc FROM V_InstitutionType ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tipos de institución");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<MasterDataDto>>> GetCategories()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT code, FullDesc FROM V_Category ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener categorías");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("states")]
    public async Task<ActionResult<List<MasterDataDto>>> GetStates()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT code, FullDesc FROM V_State ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener provincias");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("lines")]
    public async Task<ActionResult<List<MasterDataDto>>> GetLines()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT code, FullDesc FROM V_Line ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener líneas");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("audit-markets")]
    public async Task<ActionResult<List<MasterDataDto>>> GetAuditMarkets()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT codigo, DisplayMember FROM V_MercadoDeAuditoria ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener mercados de auditoría");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("audit-products")]
    public async Task<ActionResult<List<MasterDataDto>>> GetAuditProducts()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT codigo, DisplayMember FROM V_ProductoDeAuditoria ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetInt32(0).ToString(),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener productos de auditoría");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("audit-molecules")]
    public async Task<ActionResult<List<MasterDataDto>>> GetAuditMolecules()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT molecula, DisplayMember FROM V_MoleculaDeAuditoria ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetString(0),
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener moléculas de auditoría");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    // Endpoints para obtener datos completos (todos los campos) de las vistas
    [HttpGet("views/specialties")]
    public async Task<ActionResult> GetAllSpecialties()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_Specialty ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener especialidades completas");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/customer-types")]
    public async Task<ActionResult> GetAllCustomerTypes()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_CustomerType ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tipos de cliente completos");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/institution-types")]
    public async Task<ActionResult> GetAllInstitutionTypes()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_InstitutionType ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tipos de institución completos");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/categories")]
    public async Task<ActionResult> GetAllCategories()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_Category ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener categorías completas");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/states")]
    public async Task<ActionResult> GetAllStates()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_State ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener provincias completas");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/lines")]
    public async Task<ActionResult> GetAllLines()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_Line ORDER BY FullDesc";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener líneas completas");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/audit-markets")]
    public async Task<ActionResult> GetAllAuditMarkets()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_MercadoDeAuditoria ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener mercados de auditoría completos");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/audit-products")]
    public async Task<ActionResult> GetAllAuditProducts()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_ProductoDeAuditoria ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener productos de auditoría completos");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("views/audit-molecules")]
    public async Task<ActionResult> GetAllAuditMolecules()
    {
        try
        {
            var data = new List<Dictionary<string, object?>>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT * FROM V_MoleculaDeAuditoria ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (int i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        }
                        data.Add(row);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener moléculas de auditoría completas");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    // Endpoints for Direct Assignment Form
    [HttpGet("supervisors")]
    public async Task<ActionResult<List<MasterDataDto>>> GetSupervisors()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT Code, DisplayMember FROM V_Supervisor ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetValue(0).ToString() ?? string.Empty,
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener supervisores");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("representatives")]
    public async Task<ActionResult<List<MasterDataDto>>> GetRepresentatives()
    {
        try
        {
            var data = new List<MasterDataDto>();
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT Code, DisplayMember FROM V_Representative ORDER BY DisplayMember";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        data.Add(new MasterDataDto
                        {
                            Code = reader.IsDBNull(0) ? string.Empty : reader.GetValue(0).ToString() ?? string.Empty,
                            Description = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                        });
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener representantes");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("hierarchy-legacy-code/{representativeCode}")]
    public async Task<ActionResult<string>> GetRepresentativeLegacyCode(string representativeCode)
    {
        try
        {
            string? legacyCode = null;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = "SELECT TOP 1 LegacyCode FROM V_HierarchyView WHERE Code = @Code";
                var parameter = command.CreateParameter();
                parameter.ParameterName = "@Code";
                parameter.Value = representativeCode;
                command.Parameters.Add(parameter);

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        legacyCode = reader.IsDBNull(0) ? null : reader.GetString(0);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            if (legacyCode == null)
            {
                return NotFound("LegacyCode no encontrado para el representante especificado");
            }

            return Ok(new { LegacyCode = legacyCode });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener LegacyCode del representante");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("max-row-id")]
    public async Task<ActionResult<int>> GetMaxRowId()
    {
        try
        {
            int maxRowId = 0;
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = @"
                    SELECT ISNULL(MAX(RowId), 0) as MaxRowId FROM (
                        SELECT RowId FROM MigrationDirect WHERE RowId IS NOT NULL
                        UNION ALL
                        SELECT RowId FROM MigrationConfiguration WHERE RowId IS NOT NULL
                        UNION ALL
                        SELECT RowId FROM MigrationAssignment WHERE RowId IS NOT NULL
                    ) AS AllRowIds";

                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        maxRowId = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                    }
                }
                await _context.Database.CloseConnectionAsync();
            }

            return Ok(new { MaxRowId = maxRowId + 1 });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener el máximo RowId");
            return StatusCode(500, "Error interno del servidor");
        }
    }
}

public class MasterDataDto
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
