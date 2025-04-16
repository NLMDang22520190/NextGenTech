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
            var newProducts = await dbContext.Products
                .Where(p => productIds.Contains(p.ProductId.ToString()))
                .ToListAsync();
            var existingProducts = await dbContext.Promotions
                .Include(p => p.Products)
                .Where(p => p.PromotionId == promotion.PromotionId)
                .SelectMany(p => p.Products)
                .ToListAsync();

            if (existingProducts == null || existingProducts.Count == 0)
            {
                foreach (var product in newProducts)
                {
                    promotion.Products.Add(product);
                }
            }
            else
            {
                dbContext.Products.RemoveRange(existingProducts.Where(p => !newProducts.Contains(p)).ToList());
                foreach (var product in newProducts)
                {
                    if (!existingProducts.Contains(product))
                        promotion.Products.Add(product);
                }
            }
            
            await dbContext.SaveChangesAsync();
        }

        public async Task<Promotion> DeletePromotionAsync(int id)
        {
            return await DeleteAsync(p => p.PromotionId == id);
        }

        public async Task<Promotion?> UpdatePromotionAsync(int promotionId, Promotion updatedPromotion)
        {
            var existingPromotion = await dbContext.Promotions.FirstOrDefaultAsync(p => p.PromotionId == promotionId);
            if (existingPromotion == null) 
            {
                return null;
            }

            existingPromotion.Name = updatedPromotion.Name;
            existingPromotion.Description = updatedPromotion.Description;
            existingPromotion.PromotionCode = updatedPromotion.PromotionCode;
            existingPromotion.DiscountPercentage = updatedPromotion.DiscountPercentage;
            existingPromotion.StartDate = updatedPromotion.StartDate;
            existingPromotion.EndDate = updatedPromotion.EndDate;

            await dbContext.SaveChangesAsync();
            return existingPromotion;
        }
        public async Task<string> GetVoucherCodeByPromotionId(int PromotionId)
        {
            var promotion = await dbContext.Promotions.FirstOrDefaultAsync(x => x.PromotionId == PromotionId);
            if (promotion == null)
                return null;

            var promotionCode = promotion.PromotionCode;

            return promotionCode;
        }
    }
}