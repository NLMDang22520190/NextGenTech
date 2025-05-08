namespace NextGenTech.Server.Models.DTO.GET
{
    public class UserInfoDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string? District { get; set; }
        public string? City { get; set; }
        public string? PhotoUrl { get; set; }
        public string? Ward { get; set; }
    }
}