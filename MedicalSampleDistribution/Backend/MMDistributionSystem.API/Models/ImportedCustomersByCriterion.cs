using System;
using System.Collections.Generic;

namespace MMDistributionSystem.API.Models;

public partial class ImportedCustomersByCriterion
{
    public int? RowId { get; set; }

    public int? ImportId { get; set; }

    public int? CustomerCode { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }
}
