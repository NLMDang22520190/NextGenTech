namespace NextGenTech.Server.Models.DTO.GET
{
    public class ReviewDTO
    {
        public int ReviewId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public string? UserAvatar { get; set; }
        public int? ProductId { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
