using System;
using System.Collections.Generic;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Models.DTO.GET
{
    public class CustomerProductDTO
    {
        public int ProductId { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public DateTime? CreatedAt { get; set; }

        public virtual BrandDTO? Brand { get; set; }

        public virtual CategoryDTO? Category { get; set; }

        public ICollection<ProductImageDTO> ProductImages { get; set; } = new List<ProductImageDTO>();

        public decimal Rating { get; set; }
        public int ReviewCount { get; set; }

        public ICollection<CustomerProductPromotionDTO> Promotions { get; set; } = new List<CustomerProductPromotionDTO>();

        // Lấy phần trăm giảm giá cao nhất nếu có
        public string ImageUrl => ProductImages.Count > 0
            ? ProductImages.FirstOrDefault(i => i.IsPrimary == true)?.ImageUrl
                ?? ProductImages.FirstOrDefault()?.ImageUrl
                ?? string.Empty
            : string.Empty;
        public decimal? DiscountPercentage => Promotions
            .Where(p => p.StartDate <= DateTime.UtcNow && p.EndDate >= DateTime.UtcNow)
            .Select(p => p.DiscountPercentage)
            .DefaultIfEmpty(0)
            .Max();

        public decimal SalePrice => DiscountPercentage.HasValue ? Price * (1 - DiscountPercentage.Value / 100) : Price;
    }
}
