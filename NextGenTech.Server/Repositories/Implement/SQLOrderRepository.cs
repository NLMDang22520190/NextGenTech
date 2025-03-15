using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLOrderRepository : NextGenTechRepository<Order>, IOrderRepository
    {
        public SQLOrderRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}