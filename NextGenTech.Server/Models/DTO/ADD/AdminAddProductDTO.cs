namespace NextGenTech.Server.Models.DTO.ADD
{
    public class AdminAddProductDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? LongDescription { get; set; }
        public decimal Price { get; set; }

        public int StockQuantity => Colors.Sum(c => c.StockQuantity);

        public int BrandId { get; set; }
        public int CategoryId { get; set; }

        public List<string> ImageUrls { get; set; } = new List<string>();

        public List<ColorDTO> Colors { get; set; } = new List<ColorDTO>();
    }

    public class ColorDTO
    {
        public string Color { get; set; } = null!;
        public string ColorCode { get; set; } = null!;
        public int StockQuantity { get; set; }
    }
}