using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class Product
{
    public int ProductId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? LongDescription { get; set; }

    public decimal Price { get; set; }

    public int? StockQuantity { get; set; }

    public int? CategoryId { get; set; }

    public int? BrandId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Brand? Brand { get; set; }

    public virtual ICollection<CartDetail> CartDetails { get; set; } = new List<CartDetail>();

    public virtual Category? Category { get; set; }

    public virtual ICollection<ProductColor> ProductColors { get; set; } = new List<ProductColor>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
}
