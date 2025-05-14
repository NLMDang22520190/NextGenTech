using Microsoft.EntityFrameworkCore;
using NextGenTech.Server.Models;
using AutoMapper;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.GET;

namespace NextGenTech.Server.Repositories.Implement
{
	public class SQLOrderRepository : NextGenTechRepository<Order>, IOrderRepository
	{
		private readonly IMapper _mapper;
		private readonly ICartRepository _cartRepository;
		private readonly ICartDetailRepository _cartDetailRepository;
		private readonly IProductColorRepository _productColorRepository;

		public SQLOrderRepository(
			NextGenTechContext dbContext,
			IMapper mapper,
			ICartRepository cartRepository,
			ICartDetailRepository cartDetailRepository,
			IProductColorRepository productColorRepository) : base(dbContext)
		{
			_mapper = mapper;
			_cartRepository = cartRepository;
			_cartDetailRepository = cartDetailRepository;
			_productColorRepository = productColorRepository;
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
				.ThenInclude(od => od.ProductColor)
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
								   .ThenInclude(od => od.ProductColor)
								   .Include(o => o.User)
								   .FirstOrDefaultAsync(o => o.OrderId == orderId);

		}

		public Task<List<Order>> GetOrderDetailsByUserIdAsync(int userId)
		{
			var orders = dbContext.Orders.Where(x => x.UserId == userId)
				.Include(x => x.OrderDetails)
				.ThenInclude(x => x.ProductColor);
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

		// Tạo đơn hàng mới từ giỏ hàng
		public async Task<Order> CreateOrderFromCartAsync(CreateOrderRequestDTO createOrderRequest)
		{
			using var transaction = await dbContext.Database.BeginTransactionAsync();
			try
			{
				// Lấy thông tin giỏ hàng của người dùng
				var cart = await dbContext.Carts
					.FirstOrDefaultAsync(c => c.UserId == createOrderRequest.UserId);

				if (cart == null)
				{
					throw new Exception($"Không tìm thấy giỏ hàng cho người dùng có ID {createOrderRequest.UserId}");
				}

				// Lấy chi tiết giỏ hàng
				var cartDetails = await dbContext.CartDetails
					.Include(cd => cd.ProductColor)
					.ThenInclude(pc => pc.Product)
					.Where(cd => cd.CartId == cart.CartId)
					.ToListAsync();

				if (cartDetails.Count == 0)
				{
					throw new Exception("Giỏ hàng trống, không thể tạo đơn hàng");
				}

				// Tạo đơn hàng mới
				var order = _mapper.Map<Order>(createOrderRequest);

				// Tính tổng tiền đơn hàng
				decimal totalAmount = 0;

				// Thêm đơn hàng vào database
				await dbContext.Orders.AddAsync(order);
				await dbContext.SaveChangesAsync();

				// Tạo chi tiết đơn hàng từ chi tiết giỏ hàng
				foreach (var cartDetail in cartDetails)
				{
					if (cartDetail.ProductColor == null || cartDetail.ProductColor.Product == null)
					{
						continue;
					}

					// Kiểm tra số lượng tồn kho
					if (cartDetail.ProductColor.StockQuantity < cartDetail.Quantity)
					{
						throw new Exception($"Sản phẩm {cartDetail.ProductColor.Product.Name} (màu {cartDetail.ProductColor.Color}) không đủ số lượng trong kho");
					}

					// Tạo chi tiết đơn hàng
					var orderDetail = new OrderDetail
					{
						OrderId = order.OrderId,
						ProductColorId = cartDetail.ProductColorId,
						Quantity = cartDetail.Quantity,
						Price = cartDetail.ProductColor.Product.Price
					};

					// Cập nhật tổng tiền
					totalAmount += orderDetail.Price.GetValueOrDefault() * orderDetail.Quantity;

					// Thêm chi tiết đơn hàng vào database
					await dbContext.OrderDetails.AddAsync(orderDetail);

					// Giảm số lượng tồn kho
					cartDetail.ProductColor.StockQuantity -= cartDetail.Quantity;
					dbContext.ProductColors.Update(cartDetail.ProductColor);
				}

				// Cập nhật tổng tiền đơn hàng
				order.TotalAmount = totalAmount;
				dbContext.Orders.Update(order);

				// Xóa giỏ hàng
				dbContext.CartDetails.RemoveRange(cartDetails);

				await dbContext.SaveChangesAsync();
				await transaction.CommitAsync();

				return order;
			}
			catch (Exception ex)
			{
				await transaction.RollbackAsync();
				throw new Exception($"Lỗi khi tạo đơn hàng: {ex.Message}", ex);
			}
		}

	}
}