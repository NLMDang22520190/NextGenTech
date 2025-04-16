namespace NextGenTech.Server.Models.DTO.GET
{
    public class AdminUserDTO
    {
        public int UserId { get; set; }

        public string? FullName { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? City { get; set; }

        public string? District { get; set; }

        public string? Ward { get; set; }

        public string? AvatarImageUrl { get; set; }

        public string Role { get; set; } = "customer"!;

        public DateTime? CreatedAt { get; set; }
    }
}