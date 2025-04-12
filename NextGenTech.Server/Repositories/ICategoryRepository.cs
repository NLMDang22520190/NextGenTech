using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface ICategoryRepository : INextGenTechRepository<Category>
    {
         Task<List<Category>> AdminGetAllCategoryAsync();
    }
}