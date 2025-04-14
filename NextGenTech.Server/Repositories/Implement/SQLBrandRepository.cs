using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLBrandRepository : NextGenTechRepository<Brand>, IBrandRepository
    {
        public SQLBrandRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<Brand>> AdminGetAllBrandAsync()
        {
            return await dbContext.Brands
                .Include(b => b.Products)
                .ToListAsync();
        }

        public async Task<Brand> AddBrandAsync(Brand brand)
        {
            dbContext.Brands.Add(brand);
            await dbContext.SaveChangesAsync();
            return brand; // Return the generated BrandId
        }

        public async Task<Brand> DeleteBrandAsync(int brandId)
        {
            return await DeleteAsync(p => p.BrandId == brandId);
        }
    }
}