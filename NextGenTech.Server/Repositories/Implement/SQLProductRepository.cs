using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.UPDATE;
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
            .Include(p => p.ProductImages)
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

        public async Task<Product?> UpdateProductAsync(int productId, Product updatedProduct)
        {
            var existingProduct = await dbContext.Products
                .Include(p => p.ProductImages)
                .Include(p => p.ProductColors)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (existingProduct == null)
            {
                return null;
            }

            // Update product details
            existingProduct.Name = updatedProduct.Name;
            existingProduct.Description = updatedProduct.Description;
            existingProduct.LongDescription = updatedProduct.LongDescription;
            existingProduct.Price = updatedProduct.Price;
            existingProduct.StockQuantity = updatedProduct.StockQuantity;
            existingProduct.BrandId = updatedProduct.BrandId;
            existingProduct.CategoryId = updatedProduct.CategoryId;

            // Update ProductImages
            var newImageUrls = updatedProduct.ProductImages.Select(img => img.ImageUrl).ToList();
            var existingImageUrls = existingProduct.ProductImages.Select(img => img.ImageUrl).ToList();

            // Remove images not in the new list
            var imagesToRemove = existingProduct.ProductImages
                .Where(img => !newImageUrls.Contains(img.ImageUrl))
                .ToList();
            dbContext.ProductImages.RemoveRange(imagesToRemove);

            // Add new images
            var imagesToAdd = newImageUrls
                .Where(url => !existingImageUrls.Contains(url))
                .Select(url => new ProductImage { ProductId = productId, ImageUrl = url })
                .ToList();
            foreach (var image in imagesToAdd)
            {
                existingProduct.ProductImages.Add(image);
            }

            // Update ProductColors
            var newColors = updatedProduct.ProductColors.Select(c => c.ColorCode).ToList();

            // Remove colors not in the new list
            var colorsToRemove = existingProduct.ProductColors
                .Where(c => !newColors.Contains(c.ColorCode))
                .ToList();
            dbContext.ProductColors.RemoveRange(colorsToRemove);

            // Add or update colors
            foreach (var updatedColor in updatedProduct.ProductColors)
            {
                var existingColor = existingProduct.ProductColors
                    .FirstOrDefault(c => c.ColorCode == updatedColor.ColorCode);

                if (existingColor != null)
                {
                    // Update StockQuantity if it has changed
                    if (existingColor.StockQuantity != updatedColor.StockQuantity)
                    {
                        existingColor.StockQuantity = updatedColor.StockQuantity;
                    }
                }
                else
                {
                    // Add new color
                    existingProduct.ProductColors.Add(new ProductColor
                    {
                        ProductId = productId,
                        Color = updatedColor.Color,
                        ColorCode = updatedColor.ColorCode,
                        StockQuantity = updatedColor.StockQuantity
                    });
                }
            }

            await dbContext.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<Product> DeleteProductAsync(int productId)
        {
            return await DeleteAsync(p => p.ProductId == productId);
        }

        public async Task<List<Product>> GetFeatureProductsAsync()
        {
            var now = DateTime.UtcNow;

            // First try to get products with active promotions
            var productsWithPromotions = await dbContext.Products
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Include(p => p.Promotions.Where(promo =>
                    promo.StartDate <= now && promo.EndDate >= now))
                .Where(p => p.Promotions.Any(promo =>
                    promo.StartDate <= now && promo.EndDate >= now))
                .OrderByDescending(p => p.Promotions
                    .Where(promo => promo.StartDate <= now && promo.EndDate >= now)
                    .Max(promo => promo.DiscountPercentage))
                .Take(5)
                .ToListAsync();

            // If no products with promotions found, return any 5 products
            if (!productsWithPromotions.Any())
            {
                return await dbContext.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Category)
                    .Include(p => p.Promotions)
                    .Include(p => p.ProductImages)
                    .Take(5)
                    .ToListAsync();
            }

            return productsWithPromotions;
        }
    }
}
