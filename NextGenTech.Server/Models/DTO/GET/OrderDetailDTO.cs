namespace NextGenTech.Server.Models.DTO.GET
{
    public class OrderDetailDTO
    {
        public int OrderDetailId { get; set; }
        public int? OrderId { get; set; }
        public int? ProductId { get; set; }

        public int Quantity { get; set; }
        public Decimal? Price { get; set; }

    }
}