namespace NextGenTech.Server.Models.DTO.GET
{
    public class CustomerProductPromotionDTO
    {
        public int PromotionId { get; set; }
        public decimal? DiscountPercentage { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

    }
}