using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.UPDATE;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLReviewRepository : NextGenTechRepository<Review>, IReviewRepository
    {
        public SQLReviewRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

        public async Task<Review> AddReviewAsync(AddReviewRequestDTO request)
        {
            var review = new Review
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow,
            };
            
            await dbContext.Reviews.AddAsync(review);
            await dbContext.SaveChangesAsync();

            return review;
        }

        public async Task<Review?> UpdateReviewAsync(int reviewId, UpdateReviewRequestDTO request)
        {
            var review = await dbContext.Reviews.FindAsync(reviewId);
            if (review == null)
                return null;

            review.Rating = request.Rating;
            review.Comment = request.Comment;

            dbContext.Reviews.Update(review);
            await dbContext.SaveChangesAsync();

            return review;
        }

        public async Task<bool> DeleteReviewAsync(int reviewId)
        {
            var review = await dbContext.Reviews.FindAsync(reviewId);
            if (review == null)
                return false;

            dbContext.Reviews.Remove(review);
            return await dbContext.SaveChangesAsync() > 0;
        }
        
        public async Task<Review?> GetReviewByIdAsync(int id)
        {
            return await dbContext.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.ReviewId == id);
        }



    }
}