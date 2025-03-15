using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLCartRepository : NextGenTechRepository<Cart>, ICartRepository
    {
        public SQLCartRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}