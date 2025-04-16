namespace NextGenTech.Server.Models.DTO.GET
{
    public class OrderWithOrderDetailDTO
    {
        public int OrderId { get; set; }

        public string OrderState { get; set; } = null!;

        public double TotalPrice { get; set; }

        public DateTime OrderTime { get; set; }

        public int? VoucherApplied { get; set; }

        public string VoucherCode { get; set; }

        public string PaymentMethod { get; set; } = null!;

        public virtual ICollection<OrderDetailDTO> OrderDetails { get; set; } = new List<OrderDetailDTO>();
    }
}