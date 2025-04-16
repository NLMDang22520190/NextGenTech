using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface ICategoryRepository : INextGenTechRepository<Category>
    {
        Task<List<Category>> AdminGetAllCategoryAsync();
        Task<Category> AddCategoryAsync(Category category);
        Task<Category> DeleteCategoryAsync(int categoryId);
        Task<Category?> UpdateCategoryAsync(int categoryId, Category updatedCategory);
    }
}