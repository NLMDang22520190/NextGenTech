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

    }
}