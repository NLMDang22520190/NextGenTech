namespace NextGenTech.Server.Models.DTO.UPDATE
{
    public class AdminUpdateProductDTO
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? LongDescription { get; set; }
        public decimal Price { get; set; }
        public int? StockQuantity { get; set; }
        public int BrandId { get; set; }
        public int CategoryId { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<ColorUpdateDTO> Colors { get; set; } = new List<ColorUpdateDTO>();
    }

    public class ColorUpdateDTO
    {
        public string Color { get; set; } = null!;
        public string ColorCode { get; set; } = null!;
        public int? StockQuantity { get; set; }
    }
}