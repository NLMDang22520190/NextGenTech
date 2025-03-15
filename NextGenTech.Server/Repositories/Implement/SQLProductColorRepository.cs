using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLProductColorRepository : NextGenTechRepository<ProductColor>, IProductColorRepository
    {
        public SQLProductColorRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}