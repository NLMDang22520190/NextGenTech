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

        public async Task<Category?> UpdateCategoryAsync(int categoryId, Category updatedCategory)
        {
            var existingCategory = await dbContext.Categories.FirstOrDefaultAsync(p => p.CategoryId == categoryId);
            if (existingCategory == null)
            {
                return null;
            }
            existingCategory.CategoryName = updatedCategory.CategoryName;
            existingCategory.Description = updatedCategory.Description;
            
            await dbContext.SaveChangesAsync();
            return existingCategory;
        }
    }
}