namespace NextGenTech.Server.Models.DTO.GET;

public class PromotionDTO
{
    public int PromotionId { get; set; }
    public string Name { get; set; }
    public string PromotionCode { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
   
    public decimal? DiscountPercentage { get; set; }
}