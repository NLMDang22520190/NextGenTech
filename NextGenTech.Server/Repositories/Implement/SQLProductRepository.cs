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
            .Include(p => p.Promotions)
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

        public async Task<List<Product>> AdminGetAllProductAsync()
        {
            return await dbContext.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .ToListAsync();
        }
        public async Task<Product> AdminGetProductByIdAsync(int id)
        {
            return await dbContext.Products
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .Include(p => p.ProductColors)
            .FirstOrDefaultAsync(p => p.ProductId == id);
        }
        public async Task<Product> AddProductAsync(Product product)
        {
            dbContext.Products.Add(product);
            await dbContext.SaveChangesAsync();
            return product; // Return the generated ProductId
        }

        public async Task AddProductImagesAsync(List<ProductImage> productImages)
        {
            dbContext.ProductImages.AddRange(productImages);
            await dbContext.SaveChangesAsync();
        }

        public async Task AddProductColorsAsync(List<ProductColor> productColors)
        {
            dbContext.ProductColors.AddRange(productColors);
            await dbContext.SaveChangesAsync();
        }

        public async Task<List<ProductImage>> GetProductImagesByProductIdAsync(int productId)
        {
            return await dbContext.ProductImages.Where(pi => pi.ProductId == productId).ToListAsync();
        }

        public async Task<List<ProductColor>> GetProductColorsByProductIdAsync(int productId)
        {
            return await dbContext.ProductColors.Where(pc => pc.ProductId == productId).ToListAsync();
        }

        public async Task<Product> DeleteProductAsync(int productId)
        {
            return await DeleteAsync(p => p.ProductId == productId);
        }
    }
}