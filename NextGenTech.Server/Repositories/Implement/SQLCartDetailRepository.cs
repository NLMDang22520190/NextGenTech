using System.Linq.Expressions;
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

        public async Task<bool> DeleteCartDetailByCartId(int cartDetailId)
        {
            // Tạo filter dựa trên CartDetailId
            Expression<Func<CartDetail, bool>> filter = cd => cd.CartDetailId == cartDetailId;

            var status = await DeleteAsync(filter);

            if (status == null)
            {
                return false;
            }

            return true;
        }

        public async Task<List<CartDetail>> GetCartDetailByCartId(int cartId)
        {
            var cartDetails = await dbContext.CartDetails
                .ToListAsync();
            return cartDetails;
        }
    }
}