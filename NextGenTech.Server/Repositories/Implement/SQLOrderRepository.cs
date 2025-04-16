using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using AutoMapper;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.GET;

namespace NextGenTech.Server.Repositories.Implement
{
    public class SQLOrderRepository : NextGenTechRepository<Order>, IOrderRepository
    {
        private readonly IMapper _mapper;
        public SQLOrderRepository(NextGenTechContext dbContext, IMapper mapper) : base(dbContext)
        {   
             _mapper = mapper;
        }

         public async Task<List<Order>> GetOrdersByUserId(int userId)
        {
            return await dbContext.Orders
                .Where(o => o.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<OrderDTO>> GetAllOrders()
		{
			var orders = await dbContext.Orders

				.Include(o => o.OrderDetails)
				.ThenInclude(od => od.Product)
				.Include(o => o.User)
				.ToListAsync();

			var orderDTOs = _mapper.Map<List<OrderDTO>>(orders);
			orderDTOs.ForEach(o => 
			{
				if (o.VoucherApplied != null)
				{
					var promotion = dbContext.Promotions.FirstOrDefault(v => v.PromotionId == o.VoucherApplied.PromotionId);
					o.VoucherApplied = promotion?.PromotionId != null ? _mapper.Map<PromotionDTO>(promotion) : null;
				}
			});

            return orderDTOs;
		}

        // Lấy tất cả các đơn hàng
		public async Task<List<Order>> GetAllAsync()
		{
			return await dbContext.Orders.ToListAsync();
		}

        // Lấy chi tiết một đơn hàng theo ID
		public async Task<Order?> GetOrderByIdAsync(int orderId)
		{
			return await dbContext.Orders
								   .Include(o => o.OrderDetails)
								   .ThenInclude(od => od.Product)
								   .Include(o => o.User)
								   .FirstOrDefaultAsync(o => o.OrderId == orderId);
								   
		}

        public Task<List<Order>> GetOrderDetailsByUserIdAsync(int userId)
        {
            var orders = dbContext.Orders.Where(x => x.UserId == userId)
                .Include(x => x.OrderDetails)
                .ThenInclude(x => x.Product);
            return orders.ToListAsync();
        }

        // Cập nhật trạng thái của đơn hàng
		public async Task<bool> UpdateOrderStateAsync(int orderId, string newState)
		{
			var order = await dbContext.Orders.FindAsync(orderId);
			if (order != null)
			{
				order.Status = newState;
				dbContext.Orders.Update(order);
				await dbContext.SaveChangesAsync();
				return true;
			}
			return false;
		}



    }
}