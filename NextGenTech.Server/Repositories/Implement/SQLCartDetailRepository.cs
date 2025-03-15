using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLCartDetailRepository : NextGenTechRepository<CartDetail>, ICartDetailRepository
    {
        public SQLCartDetailRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}