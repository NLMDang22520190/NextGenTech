namespace NextGenTech.Server.Models.DTO.ADD
{
    public class CreateOrderRequestDTO
    {
        public int UserId { get; set; }
        public string? PaymentMethod { get; set; }
        public int? PromotionId { get; set; }
        public string? ShippingAddress { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }
    }
}
