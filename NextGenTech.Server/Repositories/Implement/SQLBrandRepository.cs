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

    }
}