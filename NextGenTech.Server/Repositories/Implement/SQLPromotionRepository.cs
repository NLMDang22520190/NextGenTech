using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLPromotionRepository : NextGenTechRepository<Promotion>, IPromotionRepository
    {
        public SQLPromotionRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<Promotion>> CustomerGetAllAvailablePromotionAsync()
        {
            return await dbContext.Promotions.Where(p => p.StartDate <= DateTime.Now && p.EndDate >= DateTime.Now).ToListAsync();
        }

        public async Task<List<Promotion>> AdminGetAllPromotionsAsync()
        {
            return await dbContext.Promotions.Include(p => p.Products).ToListAsync();
        }

        public async Task<Promotion> AdminGetPromotionByIdAsync(int id)
        {
            return await dbContext.Promotions.Include(p => p.Products).FirstOrDefaultAsync(p => p.PromotionId == id);
        }

        public async Task<Promotion> AddPromotionAsync(Promotion promotion)
        {
            await dbContext.Promotions.AddAsync(promotion);
            await dbContext.SaveChangesAsync();
            return promotion;
        }

        public async Task LinkProductsToPromotionAsync(Promotion promotion, ICollection<string> productIds)
        {
            var products = await dbContext.Products
                .Where(p => productIds.Contains(p.ProductId.ToString()))
                .ToListAsync();

            foreach (var product in products)
            {
                promotion.Products.Add(product);
            }
            
            await dbContext.SaveChangesAsync();
        }

        public async Task<Promotion> DeletePromotionAsync(int id)
        {
            return await DeleteAsync(p => p.PromotionId == id);
        }
    }
}