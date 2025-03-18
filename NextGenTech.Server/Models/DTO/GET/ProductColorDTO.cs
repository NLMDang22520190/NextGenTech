namespace NextGenTech.Server.Models.DTO.GET
{
    public class ProductColorDTO
    {
        public int ProductColorId { get; set; }
        public string Color { get; set; } = null!;

        public string ColorCode { get; set; } = null!;

        public int? StockQuantity { get; set; }

    }
}