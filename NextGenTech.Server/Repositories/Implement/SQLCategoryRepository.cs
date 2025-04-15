using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLCategoryRepository : NextGenTechRepository<Category>, ICategoryRepository
    {
        public SQLCategoryRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

        public async Task<List<Category>> AdminGetAllCategoryAsync()
        {
            return await dbContext.Categories
                .Include(p => p.Products)
                .ToListAsync();
        }

        public async Task<Category> AddCategoryAsync(Category category)
        {
            await dbContext.Categories.AddAsync(category);
            await dbContext.SaveChangesAsync();
            return category;
        }

        public async Task<Category> DeleteCategoryAsync(int categoryId)
        {
            return await DeleteAsync(p => p.CategoryId == categoryId);
        }
    }
}