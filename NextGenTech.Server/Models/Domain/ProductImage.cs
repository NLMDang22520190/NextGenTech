using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class ProductImage
{
    public int ImageId { get; set; }

    public int? ProductId { get; set; }

    public string ImageUrl { get; set; } = null!;

    public bool? IsPrimary { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Product? Product { get; set; }
}
