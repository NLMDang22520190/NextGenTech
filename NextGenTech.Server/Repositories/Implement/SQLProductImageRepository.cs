using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLProductImageRepository : NextGenTechRepository<ProductImage>, IProductImageRepository
    {
        public SQLProductImageRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}