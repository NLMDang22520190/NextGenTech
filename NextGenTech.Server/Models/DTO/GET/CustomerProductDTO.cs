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

        private ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

        // public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

        private ICollection<CustomerProductPromotionDTO> Promotions { get; set; } = new List<CustomerProductPromotionDTO>();

        // Lấy phần trăm giảm giá cao nhất nếu có
        public string ImageUrl => ProductImages.Count > 0 ? ProductImages.Where(i => i.IsPrimary == true).FirstOrDefault().ImageUrl : string.Empty;
        public decimal? DiscountPercentage => Promotions
            .Where(p => p.StartDate <= DateTime.UtcNow && p.EndDate >= DateTime.UtcNow)
            .Select(p => p.DiscountPercentage)
            .DefaultIfEmpty(0)
            .Max();

        public decimal SalePrice => DiscountPercentage.HasValue ? Price * (1 - DiscountPercentage.Value / 100) : Price;
    }
}
