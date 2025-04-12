namespace NextGenTech.Server.Models.DTO.GET
{
    public class OrderDTO 
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? TotalAmount { get; set; }

        public virtual PromotionDTO VoucherApplied { get; set; }
        public List<OrderDetailDTO> OrderDetails { get; set; } = new();
    }
}