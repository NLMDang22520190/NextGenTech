namespace NextGenTech.Server.Models.DTO.GET
{
    public class CustomerPromotionDTO
    {
        public int PromotionId { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public string PromotionCode { get; set; } = null!;

        public decimal? DiscountPercentage { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

    }
}