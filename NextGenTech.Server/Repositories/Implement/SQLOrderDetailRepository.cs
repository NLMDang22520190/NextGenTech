using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using NextGenTech.Server.Models.Domain;


namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLOrderDetailRepository : NextGenTechRepository<OrderDetail>, IOrderDetailRepository
    {
        
        public SQLOrderDetailRepository(NextGenTechContext dbContext) : base(dbContext)
        {
        }
        // Lấy tất cả chi tiết đơn hàng theo OrderId
        public async Task<List<OrderDetail>> GetOrderDetailsByOrderIdAsync(int orderId)
        {
            return await dbContext.OrderDetails
            .Where(od => od.OrderId == orderId)
            .ToListAsync();
        }


        // Lấy chi tiết đơn hàng theo orderDetailId
        public async Task<OrderDetail> GetByIdAsync(int orderDetailId)
        {
            try
            {
                var orderDetail = await dbContext.OrderDetails
                .FirstOrDefaultAsync(od => od.OrderDetailId == orderDetailId);

                if (orderDetail == null)
                {
                    throw new KeyNotFoundException($"Order Detail with ID {orderDetailId} not found.");
                }
                return orderDetail;
            }
            catch(Exception ex)
            {
                throw new Exception($"Error fetching OrderDetail by ID: {ex.Message}", ex);
            }
        }

        






    }
}