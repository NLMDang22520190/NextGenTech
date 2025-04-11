namespace NextGenTech.Server.Models.DTO.GET
{
    public class OrderDTO 
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
    }
}