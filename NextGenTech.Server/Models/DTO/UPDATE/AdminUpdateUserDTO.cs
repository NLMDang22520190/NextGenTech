namespace NextGenTech.Server.Models.DTO.UPDATE
{
    public class AdminUpdateUserDTO
    {
        public string FullName { get; set; } = null!;
        public string? Phone { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
        public string? AvatarImageUrl { get; set; }
        public string? Role { get; set; }
    }
}