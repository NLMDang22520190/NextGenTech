using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLReviewRepository : NextGenTechRepository<Review>, IReviewRepository
    {
        public SQLReviewRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }


    }
}