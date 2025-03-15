using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class Brand
{
    public int BrandId { get; set; }

    public string BrandName { get; set; } = null!;

    public string? BrandImageUrl { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
