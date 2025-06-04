using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Models.DTO.GET
{
    public class CustomerDetailProductDTO
    {
        public int ProductId { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public string LongDescription { get; set; } = null!;

        public decimal Price { get; set; }

        public int? StockQuantity { get; set; }

        public DateTime? CreatedAt { get; set; }

        public virtual BrandDTO? Brand { get; set; }

        public virtual CategoryDTO? Category { get; set; }

        public ICollection<ProductImageDTO> ProductImages { get; set; } = new List<ProductImageDTO>();
        public ICollection<ProductColorDTO> ProductColors { get; set; } = new List<ProductColorDTO>();
        public ICollection<ReviewDTO> Reviews { get; set; } = new List<ReviewDTO>();
        public decimal Rating { get; set; }
        public int ReviewCount { get; set; }

        private ICollection<CustomerProductPromotionDTO> Promotions { get; set; } = new List<CustomerProductPromotionDTO>();

        public decimal? DiscountPercentage => Promotions
         .Where(p => p.StartDate <= DateTime.UtcNow && p.EndDate >= DateTime.UtcNow)
         .Select(p => p.DiscountPercentage)
         .DefaultIfEmpty(0)
         .Max();

        public decimal SalePrice => DiscountPercentage.HasValue ? Price * (1 - DiscountPercentage.Value / 100) : Price;
    }
}