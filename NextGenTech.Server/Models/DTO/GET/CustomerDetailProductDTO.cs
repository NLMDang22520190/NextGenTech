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

        public virtual ICollection<ProductImageDTO> ProductImages { get; set; } = new List<ProductImageDTO>();
        public virtual ICollection<ProductColorDTO> ProductColors { get; set; } = new List<ProductColorDTO>();

        // public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

        // public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

        // public virtual ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
    }
}