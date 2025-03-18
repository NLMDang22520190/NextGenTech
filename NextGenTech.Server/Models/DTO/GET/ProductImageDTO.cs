namespace NextGenTech.Server.Models.DTO.GET
{
    public class ProductImageDTO
    {
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = null!;

        public bool? IsPrimary { get; set; }
    }
}