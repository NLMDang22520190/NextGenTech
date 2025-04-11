using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.Domain;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IOrderRepository _orderRepository;

        public OrderDetailController(IUserRepository userRepository, IMapper mapper, IOrderDetailRepository orderDetailRepository, IOrderRepository orderRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _orderDetailRepository = orderDetailRepository;
            _orderRepository = orderRepository;
        }

        //Lấy tất cả chi tiết đơn hàng
        [HttpGet("get-all")]

        public async Task<ActionResult<List<OrderDetail>>> GetAllOrderDetails()
        {
            var orderDetails = await _orderDetailRepository.GetAllAsync();
            if (orderDetails == null || orderDetails.Count == 0)
            {
                return NotFound("No order Details found");
            }
            return Ok(orderDetails);

        }

        //Lấy chi tiết đơn hàng theo Id
        [HttpGet("{orderDetailId}")]

        public async Task<ActionResult<OrderDetail>> GetOrderDetailById(int orderDetailId)
        {
            if (orderDetailId <= 0)
            {
                return BadRequest("Invalid order detail Id");
            }

            var orderDetail = await _orderDetailRepository.GetByIdAsync(orderDetailId);
            if (orderDetail == null)
            {
                return NotFound($"Order detail with ID {orderDetailId} not found.");
            }
            return Ok(orderDetail);
        }

        //Lấy OrderDetail theo OrderId
		[HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetOrderDetailsByOrderId(int orderId)
		{
			var orderDetails = await _orderDetailRepository.GetOrderDetailsByOrderIdAsync(orderId);
			if (orderDetails == null || !orderDetails.Any())
			{
				return NotFound($"No order details found for OrderId {orderId}");
			}
			return Ok(orderDetails);
		}


    }
}