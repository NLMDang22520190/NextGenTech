using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface ICartRepository : INextGenTechRepository<Cart>
    {
        Task<Cart> GetCartByCustomerId(string userId);
        Task<bool> ClearCustomerCart(string userId);
    }
}