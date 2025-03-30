using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IOrderRepository : INextGenTechRepository<Order>
    {
        Task<List<Order>> GetOrdersByUserId(int userId);
    }
}