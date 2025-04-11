using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.GET;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMapper _mapper;

        public OrderController(IOrderRepository orderRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
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

    }
}