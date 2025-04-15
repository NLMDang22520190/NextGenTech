using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLProductColorRepository : NextGenTechRepository<ProductColor>, IProductColorRepository
    {
        public SQLProductColorRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

        public async Task AddProductColorsAsync(List<ProductColor> productColors)
        {
            dbContext.ProductColors.AddRange(productColors);
            await dbContext.SaveChangesAsync();
        }

        public async Task<List<ProductColor>> GetProductColorsByProductIdAsync(int productId)
        {
            return await dbContext.ProductColors.Where(pc => pc.ProductId == productId).ToListAsync();
        }
    }
}