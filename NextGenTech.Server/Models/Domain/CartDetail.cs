using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class CartDetail
{
    public int CartDetailId { get; set; }

    public int? CartId { get; set; }

    public int? ProductId { get; set; }

    public int Quantity { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual Product? Product { get; set; }
}
