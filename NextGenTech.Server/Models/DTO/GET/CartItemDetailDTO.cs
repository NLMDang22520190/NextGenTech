namespace NextGenTech.Server.Models.DTO.GET
{
    public class CartItemDetailDTO
    {
        public int CartDetailId { get; set; }
        public int CartId { get; set; }
        public int Quantity { get; set; }

        public virtual CartItemDTO ProductColor { get; set; } = null!; // Sử dụng CartItemDTO để lấy thông tin sản phẩm

    }
}