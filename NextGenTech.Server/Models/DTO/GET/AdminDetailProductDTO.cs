using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Models.DTO.GET
{
    public class AdminDetailProductDTO
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
        public decimal Rating { get; set; }
        public int ReviewCount { get; set; }

        // public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}