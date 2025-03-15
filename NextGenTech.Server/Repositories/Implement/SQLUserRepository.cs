using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLUserRepository : NextGenTechRepository<User>, IUserRepository
    {
        public SQLUserRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}