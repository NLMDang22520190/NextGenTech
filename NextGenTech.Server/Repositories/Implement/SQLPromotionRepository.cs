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
    }
}