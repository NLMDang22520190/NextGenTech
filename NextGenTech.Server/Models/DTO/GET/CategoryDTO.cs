namespace NextGenTech.Server.Models.DTO.GET
{
    public class CategoryDTO
    {
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = null!;

        public string? CategoryImageUrl { get; set; }

    }
}