using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.GET;
using NextGenTech.Server.Models.Domain;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {

        private readonly IPromotionRepository _promotionRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public OrderController(IOrderRepository orderRepository, IMapper mapper, IPromotionRepository promotionRepository)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
            _promotionRepository = promotionRepository;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetOrdersByUser(int userId)
        {
            var orders = await _orderRepository.GetOrdersByUserId(userId);
            if (orders == null || orders.Count == 0)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng nào cho User này." });
            }

            // Chuyển đổi sang DTO trước khi trả về API
            var orderDTOs = _mapper.Map<List<OrderDTO>>(orders);
            return Ok(orderDTOs);
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _orderRepository.GetAllOrders();
            return Ok(orders);
        }

        // Lấy tất cả các đơn hàng
        [HttpGet("get-all")]
        public async Task<ActionResult<List<Order>>> GetAllOrders()
        {
            var orders = await _orderRepository.GetAllAsync();
            if (orders == null || orders.Count == 0)
            {
                return NotFound("No orders found.");
            }
            return Ok(orders);
        }

        // Lấy chi tiết đơn hàng theo ID
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrderById(int orderId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);

            if (order == null)
                return NotFound(new { message = $"Không tìm thấy đơn hàng với ID {orderId}." });

            // Mapping thủ công (hoặc dùng AutoMapper nếu có)
            var dto = new OrderDTO
            {
                OrderId = order.OrderId,
                Status = order.Status,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                VoucherApplied = order.Promotion == null ? null : new PromotionDTO
                {
                    PromotionId = order.Promotion.PromotionId,
                    PromotionCode = order.Promotion.PromotionCode,
                    DiscountPercentage = order.Promotion.DiscountPercentage
                },
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailDTO
                {
                    OrderDetailId = od.OrderDetailId,
                    OrderId = od.OrderId,
                    ProductColorId = od.ProductColorId,
                    Quantity = od.Quantity,
                    Price = od.Price
                }).ToList()
            };

            return Ok(dto);
        }


        [HttpGet("GetOrderDetailsByUserId/{userId}")]
        public async Task<IActionResult> GetOrderDetailsByUserId(int userId)
        {
            var order = await _orderRepository.GetOrderDetailsByUserIdAsync(userId);
            if (order == null || !order.Any())
            {
                return NotFound($"No orders found for UserId {userId}");
            }
            var result = _mapper.Map<List<OrderWithOrderDetailDTO>>(order);

            foreach (var orderDetail in result)
            {
                if (orderDetail.VoucherApplied.HasValue)
                    orderDetail.VoucherCode =
                        await _promotionRepository.GetVoucherCodeByPromotionId(orderDetail.VoucherApplied
                            .Value);
                else
                    orderDetail.VoucherCode = null;
            }

            return Ok(result);
        }

        [HttpPut("update-order-state/{orderId}")]
        public async Task<ActionResult> UpdateOrderState(int orderId, [FromBody] string newState)
        {
            var result = await _orderRepository.UpdateOrderStateAsync(orderId, newState);
            if (!result)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }
            return NoContent();
        }

        // Tạo đơn hàng mới từ giỏ hàng
        [HttpPost("create")]
        public async Task<ActionResult> CreateOrder([FromBody] CreateOrderRequestDTO createOrderRequest)
        {
            try
            {
                // Kiểm tra dữ liệu đầu vào
                if (createOrderRequest.UserId <= 0)
                {
                    return BadRequest("UserId không hợp lệ");
                }

                // Tạo đơn hàng
                var order = await _orderRepository.CreateOrderFromCartAsync(createOrderRequest);

                // Trả về thông tin đơn hàng đã tạo
                var orderDTO = _mapper.Map<OrderDTO>(order);
                return CreatedAtAction(nameof(GetOrderById), new { orderId = order.OrderId }, orderDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}