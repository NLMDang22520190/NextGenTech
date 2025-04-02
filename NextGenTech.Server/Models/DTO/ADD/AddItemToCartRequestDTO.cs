namespace NextGenTech.Server.Models.DTO.ADD
{
    public class AddItemToCartRequestDTO
    {
        public int CartId { get; set; }

        public int ProductColorId { get; set; }

        public int Quantity { get; set; }


    }
}