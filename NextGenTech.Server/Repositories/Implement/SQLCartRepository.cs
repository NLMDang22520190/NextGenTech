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

        public Task<bool> ClearCustomerCart(string userId)
        {
            throw new NotImplementedException();
        }

        public async Task<Cart> GetCartByCustomerId(string userId)
        {
            var cart = await dbContext.Carts
                .FirstOrDefaultAsync(x => x.UserId == Convert.ToInt32(userId));

            if (cart == null)
                throw new ArgumentException("Cart not found for this user.");

            return cart;
        }

    }
}