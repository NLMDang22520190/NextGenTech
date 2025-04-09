using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.GET;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.UPDATE;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly ICartDetailRepository _cartDetailRepository;
        private readonly IMapper _mapper;

        public CartController(ICartRepository cartRepository, ICartDetailRepository cartDetailRepository, IMapper mapper)
        {
            _cartRepository = cartRepository;
            _cartDetailRepository = cartDetailRepository;
            _mapper = mapper;
        }

        [HttpGet("GetCartIdByCustomerId/{customerId}")]
        public async Task<IActionResult> GetCartIdByCustomerId(string customerId)
        {
            var cartDomain = await _cartRepository.GetCartByCustomerId(customerId);
            if (cartDomain == null)
            {
                return NotFound($"No cart found for UserId {customerId}");
            }
            return Ok(cartDomain.CartId);
        }

        [HttpGet("GetCartDetailsByCustomerId/{customerId}")]
        public async Task<IActionResult> GetCartDetailsByCustomerId(string customerId)
        {
            var cartDomain = await _cartRepository.GetCartByCustomerId(customerId);
            if (cartDomain == null)
            {
                return NotFound($"No cart found for UserId {customerId}");
            }

            var cartDetailsDomain = await _cartDetailRepository.GetLongCartDetailByCartId(cartDomain.CartId);
            if (cartDetailsDomain == null)
            {
                return NotFound($"No cart details found for CartId {cartDomain.CartId}");
            }

            return Ok(_mapper.Map<List<CartItemDetailDTO>>(cartDetailsDomain));
        }

        // POST: api/Cart/AddItemToCart
        [HttpPost("AddItemToCart")]
        public async Task<IActionResult> AddItemToCart([FromBody] AddItemToCartRequestDTO requestDto)
        {
            try
            {
                // Gọi phương thức AddCartDetailAsync để thêm sản phẩm vào giỏ
                var cartDetailDomain = _mapper.Map<CartDetail>(requestDto);

                var cartDetailByUserDomain = await _cartDetailRepository.GetShortCartDetailByCartId(requestDto.CartId);

                // Kiểm tra xem sản phẩm đã tồn tại trong giỏ chưa
                var existingCartDetail = cartDetailByUserDomain.FirstOrDefault(cd => cd.ProductColorId == requestDto.ProductColorId);

                if (existingCartDetail != null)
                {

                    var updatedCartDetail = await _cartDetailRepository.UpdateAsync(
                        cd => cd.CartDetailId == existingCartDetail.CartDetailId, // filter
                        existingRecord =>
                        {
                            existingRecord.Quantity += requestDto.Quantity;
                        }
                    );
                }
                else
                {
                    await _cartDetailRepository.CreateAsync(cartDetailDomain);
                }

                return Ok("Success");
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return BadRequest($"Error adding item to cart: {ex.Message}");
            }
        }

        [HttpPut("UpdateItemInCart")]
        public async Task<IActionResult> UpdateItemInCart([FromBody] UpdateCartItemRequestDTO requestDto)
        {
            try
            {
                // Ánh xạ dữ liệu từ DTO sang đối tượng CartDetail
                var cartDetail = _mapper.Map<CartDetail>(requestDto);

                // Sử dụng hàm tổng quan để cập nhật
                var updatedCartDetail = await _cartDetailRepository.UpdateAsync(
                    cd => cd.CartDetailId == requestDto.CartDetailId, // filter
                    existingRecord =>
                    {
                        existingRecord.Quantity = cartDetail.Quantity;
                    }
                );

                if (updatedCartDetail == null)
                {
                    return NotFound($"Cart detail with ID {requestDto.CartDetailId} not found.");
                }

                var cartDetailsDomain = await _cartDetailRepository.GetLongCartDetailByCartId((int)updatedCartDetail.CartId!);

                var cartDomain = cartDetailsDomain.FirstOrDefault(x => x.CartDetailId == updatedCartDetail.CartDetailId);

                return Ok(_mapper.Map<CartItemDetailDTO>(cartDomain));
            }
            catch (Exception ex)
            {
                // Xử lý lỗi chung
                return BadRequest($"Error updating item in cart: {ex.Message}");
            }
        }

        [HttpDelete("DeleteItemFromCart/{cartDetailId}")]
        public async Task<IActionResult> DeleteItemFromCart(int cartDetailId)
        {
            try
            {
                // Gọi phương thức xóa từ repository và đợi kết quả
                var isDeleted = await _cartDetailRepository.DeleteCartDetailByCartId(cartDetailId);

                if (!isDeleted)
                {
                    return NotFound($"Cart detail with ID {cartDetailId} not found.");
                }

                return Ok($"Cart item with ID {cartDetailId} deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting item from cart: {ex.Message}");
            }
        }

        [HttpDelete("ClearCustomerCart/{customerId}")]
        public async Task<IActionResult> ClearCustomerCart(int customerId)
        {
            try
            {
                var isDeleted = await _cartRepository.ClearCustomerCart(customerId);
                return Ok("Clear cart success");

            }
            catch (Exception ex)
            {
                return BadRequest($"Error clearing cart: {ex.Message}");
            }
        }

    }
}