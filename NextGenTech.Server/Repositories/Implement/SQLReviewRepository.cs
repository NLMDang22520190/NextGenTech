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
            // Validate that the Product exists
            var productExists = await dbContext.Products.AnyAsync(p => p.ProductId == request.ProductId);
            if (!productExists)
            {
                throw new ArgumentException($"Product with ID {request.ProductId} does not exist.");
            }

            // Validate that the User exists
            var userExists = await dbContext.Users.AnyAsync(u => u.UserId == request.UserId);
            if (!userExists)
            {
                throw new ArgumentException($"User with ID {request.UserId} does not exist.");
            }

            // Check if user has already reviewed this product
            var existingReview = await dbContext.Reviews
                .FirstOrDefaultAsync(r => r.UserId == request.UserId && r.ProductId == request.ProductId);
            if (existingReview != null)
            {
                throw new InvalidOperationException("User has already reviewed this product.");
            }

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

        public async Task<List<Review>> GetReviewsByProductIdAsync(int productId)
        {
            return await dbContext.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }
    }
}