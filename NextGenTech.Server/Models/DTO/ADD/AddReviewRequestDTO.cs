namespace NextGenTech.Server.Models.DTO.ADD
{
    public class AddReviewRequestDTO
    {
        public int UserId { get; set; }
        public int ProductId { get; set;}
        public int Rating { get; set; }
        public string? Comment { get; set; }

    }
}