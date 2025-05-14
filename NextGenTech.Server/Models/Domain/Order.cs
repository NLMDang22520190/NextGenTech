using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class Order
{
    public int OrderId { get; set; }

    public int? UserId { get; set; }

    public DateTime? OrderDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string Status { get; set; } = null!;

    public string? PaymentMethod { get; set; }

    public int? PromotionId { get; set; }

    public string? ShippingAddress { get; set; }

    public string? FullName { get; set; }

    public string? Phone { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual Promotion? Promotion { get; set; }

    public virtual User? User { get; set; }
}
