using System;
using System.Collections.Generic;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Models.DTO.GET
{
    public class AdminProductDTO
    {
        public int ProductId { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int? StockQuantity { get; set; }

        public DateTime? CreatedAt { get; set; }

        public virtual BrandDTO? Brand { get; set; }

        public virtual CategoryDTO? Category { get; set; }

        public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

        // Lấy phần trăm giảm giá cao nhất nếu có
        public string ImageUrl => ProductImages.Count > 0 ? ProductImages.Where(i => i.IsPrimary == true).FirstOrDefault().ImageUrl : string.Empty;
    }
}
