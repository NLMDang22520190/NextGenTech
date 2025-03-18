using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLProductRepository : NextGenTechRepository<Product>, IProductRepository
    {
        public SQLProductRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<Product>> CustomerGetAllProductAsync()
        {
            return await dbContext.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .ToListAsync();
        }

        public async Task<Product> CustomerGetProductByIdAsync(int id)
        {
            return await dbContext.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.ProductColors)
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.ProductId == id);
        }
    }
}