using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLProductRepository : NextGenTechRepository<Product>, IProductRepository
    {
        public SQLProductRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }

    }
}