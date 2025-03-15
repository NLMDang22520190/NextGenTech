using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class Product
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal Price { get; set; }

    public virtual Brand Brand { get; set; } = null!;
}
