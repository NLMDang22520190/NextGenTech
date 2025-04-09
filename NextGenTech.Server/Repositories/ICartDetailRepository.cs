using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface ICartDetailRepository : INextGenTechRepository<CartDetail>
    {
        // Get Cart Details by Cart ID
        Task<List<CartDetail>> GetLongCartDetailByCartId(int cartId);

        Task<List<CartDetail>> GetShortCartDetailByCartId(int cartId);

        // Delete Cart Detail by Cart Detail ID
        Task<bool> DeleteCartDetailByCartId(int cartDetailId);
    }
}