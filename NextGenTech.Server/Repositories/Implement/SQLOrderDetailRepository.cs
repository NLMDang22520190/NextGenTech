using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLOrderDetailRepository : NextGenTechRepository<OrderDetail>, IOrderDetailRepository
    {
        public SQLOrderDetailRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}