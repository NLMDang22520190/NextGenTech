using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class Promotion
{
    public int PromotionId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string PromotionCode { get; set; } = null!;

    public decimal? DiscountPercentage { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
