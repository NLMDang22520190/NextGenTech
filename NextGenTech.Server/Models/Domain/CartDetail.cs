using System;
using System.Collections.Generic;

namespace NextGenTech.Server.Models.Domain;

public partial class CartDetail
{
    public int CartDetailId { get; set; }

    public int? CartId { get; set; }

    public int? ProductColorId { get; set; }  // Thay đổi từ ProductId sang ProductColorId

    // public int? ProductId { get; set; }  // Xóa trường này vì không cần thiết trong CartDetail

    public int Quantity { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual ProductColor? ProductColor { get; set; }  // Cập nhật mối quan hệ

    // public virtual Product? Product { get; set; }  // Cập nhật mối quan hệ
}
