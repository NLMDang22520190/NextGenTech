using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.UPDATE;

namespace NextGenTech.Server.Repositories
{
    public interface IReviewRepository : INextGenTechRepository<Review>
    {
        Task<Review> AddReviewAsync(AddReviewRequestDTO request);
        Task<Review?> UpdateReviewAsync(int reviewId, UpdateReviewRequestDTO request);
        Task<bool> DeleteReviewAsync(int reviewId);
        Task<Review?> GetReviewByIdAsync(int id);
        Task<List<Review>> GetReviewsByProductIdAsync(int productId);
    }
}