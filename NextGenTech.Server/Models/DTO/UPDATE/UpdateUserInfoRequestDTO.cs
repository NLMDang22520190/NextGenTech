namespace NextGenTech.Server.Models.DTO.UPDATE
{
    public class UpdateUserInfoRequestDTO
    {
        public string FullName { get; set; }
        public string Phone { get; set;}
        public string? City { get; set;}
        public string? District { get; set;}
        public string? Ward { get; set;}
        public string? PhotoUrl { get; set;}    

    }
}