using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLProductImageRepository : NextGenTechRepository<ProductImage>, IProductImageRepository
    {
        public SQLProductImageRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

        public async Task AddProductImagesAsync(List<ProductImage> productImages)
        {
            dbContext.ProductImages.AddRange(productImages);
            await dbContext.SaveChangesAsync();
        }

        public async Task<List<ProductImage>> GetProductImagesByProductIdAsync(int productId)
        {
            return await dbContext.ProductImages.Where(pi => pi.ProductId == productId).ToListAsync();
        }
    }
}