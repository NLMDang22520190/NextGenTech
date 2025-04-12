namespace NextGenTech.Server.Models.DTO.GET
{
    public class AdminBrandDTO
    {
        public int BrandId { get; set; }

        public string BrandName { get; set; } = null!;

        public string? BrandImageUrl { get; set; }
    }
}