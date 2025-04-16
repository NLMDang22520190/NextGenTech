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
            .ToListAsync();
        }

        public async Task<List<Product>> AdminGetAllProductAsync()
        {
            return await dbContext.Products
            .Include(p => p.Category)
            .Include(p=>p.ProductImages)
            .Include(p => p.ProductColors)
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


        public async Task<Product> AddProductAsync(AddProductRequestDTO request)
        {
            var product = new Product
            {
                Name = request.Name,
                Price = request.Price,
                StockQuantity = request.StockQuantity,
                CategoryId = request.Category?.CategoryId,
                CreatedAt = DateTime.Now
            };

            // Thêm image
            foreach (var image in request.ProductImages)
            {
                product.ProductImages.Add(new ProductImage
                {
                    ImageUrl = image.ImageUrl,
                    IsPrimary = image.IsPrimary
                });
            }

            // Thêm color
            product.ProductColors.Clear();
            foreach (var colorDto in request.ProductColors)
            {
                product.ProductColors.Add(new ProductColor
                {
                    Color = colorDto.Color,
                    ColorCode = colorDto.ColorCode
                });
            }

            await dbContext.Products.AddAsync(product);
            await dbContext.SaveChangesAsync();

            return product;
        }



        public async Task<Product?> UpdateProductAsync(int productId, UpdateProductRequestDTO request)
        {
            var product = await dbContext.Products
            .Include(p => p.ProductImages)
            .Include(p => p.ProductColors)
            .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                return null;
            }

            product.Name = request.Name;
            product.Price = request.Price;
            product.ProductImages.Clear();
            foreach (var image in request.ProductImages)
            {
                product.ProductImages.Add(new ProductImage
                {
                    ImageUrl = image.ImageUrl,
                    IsPrimary = image.IsPrimary
                });
            }

            product.ProductColors.Clear();
            foreach (var colorDto in request.ProductColors)
            {
                product.ProductColors.Add(new ProductColor
                {
                    Color = colorDto.Color,
                    ColorCode = colorDto.ColorCode
                });
            }

            await dbContext.SaveChangesAsync();
            return product;
        }
    }
}