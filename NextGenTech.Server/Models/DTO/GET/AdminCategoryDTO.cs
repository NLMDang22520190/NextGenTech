namespace NextGenTech.Server.Models.DTO.GET
{
    public class AdminCategoryDTO
    {
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = null!;

        public string? Description { get; set; }
    }
}