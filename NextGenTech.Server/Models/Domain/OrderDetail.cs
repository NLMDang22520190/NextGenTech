using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class OrderDetail
{
    public int OrderDetailId { get; set; }

    public int? OrderId { get; set; }

    public int? ProductColorId { get; set; }  // Chỉ sử dụng ProductColorId

    public int Quantity { get; set; }

    public decimal? Price { get; set; }

    public decimal? DiscountPercentage { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual ProductColor? ProductColor { get; set; }  // Quan hệ với ProductColor
}
