using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.GET;

namespace NextGenTech.Server.Repositories
{
    public interface IOrderRepository : INextGenTechRepository<Order>
    {
        Task<List<Order>> GetOrdersByUserId(int userId);
        Task<Order?> GetOrderByIdAsync(int orderId);
        Task<List<OrderDTO>> GetAllOrders();
		Task<List<Order>> GetAllAsync();

        Task<List<Order>> GetOrderDetailsByUserIdAsync(int userId);

        Task<bool> UpdateOrderStateAsync(int orderId, string newState);
    }
}