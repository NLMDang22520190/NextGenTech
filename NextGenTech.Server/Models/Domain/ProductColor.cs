﻿using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class ProductColor
{
    public int ProductColorId { get; set; }

    public int? ProductId { get; set; }

    public string Color { get; set; } = null!;

    public string ColorCode { get; set; } = null!;

    public int? StockQuantity { get; set; }

    public virtual Product? Product { get; set; }

    public virtual ICollection<CartDetail> CartDetails { get; set; } = new List<CartDetail>();

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
