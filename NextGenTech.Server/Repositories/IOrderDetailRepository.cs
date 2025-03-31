using NextGenTech.Server.Models.Domain;

namespace NextGenTech.Server.Repositories
{
    public interface IOrderDetailRepository : INextGenTechRepository<OrderDetail>
    {
       
        Task<OrderDetail> GetByIdAsync(int orderDetailId);

        Task<List<OrderDetail>> GetOrderDetailsByOrderIdAsync(int orderId);
    }
}