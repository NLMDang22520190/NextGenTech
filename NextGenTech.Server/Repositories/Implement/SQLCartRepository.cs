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

        public async Task<bool> ClearCustomerCart(int userId)
        {
            var cart = await dbContext.Carts
                .FirstOrDefaultAsync(x => x.UserId == Convert.ToInt32(userId));

            var cartDetails = await dbContext.CartDetails.Where(cd => cd.CartId == cart.CartId).ToListAsync();

            if (!cartDetails.Any()) return false;

            dbContext.CartDetails.RemoveRange(cartDetails);
            await dbContext.SaveChangesAsync();
            return true;

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