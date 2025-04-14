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
            return await dbContext.Promotions.ToListAsync();
        }

        public async Task<Promotion> AdminGetPromotionByIdAsync(int id)
        {
            return await dbContext.Promotions.FirstOrDefaultAsync(p => p.PromotionId == id);
        }
    }
}