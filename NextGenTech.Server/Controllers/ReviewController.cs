using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.DTO.UPDATE;
using NextGenTech.Server.Models.DTO.GET;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly IReviewRepository _reviewRepository;

        public ReviewController(IUserRepository userRepository, IProductRepository productRepository, IMapper mapper, IReviewRepository reviewRepository)
        {
            _userRepository = userRepository;
            _productRepository = productRepository;
            _mapper = mapper;
            _reviewRepository = reviewRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddReview([FromBody] AddReviewRequestDTO request)
        {
            // Validate input
            if (request == null)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Request data is required"
                });
            }

            if (request.UserId <= 0)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Valid User ID is required"
                });
            }

            if (request.ProductId <= 0)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Valid Product ID is required"
                });
            }

            if (request.Rating < 1 || request.Rating > 5)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Rating must be between 1 and 5"
                });
            }

            try
            {
                var review = await _reviewRepository.AddReviewAsync(request);
                return Ok(new
                {
                    status = "success",
                    message = "Review has been submitted successfully",
                    data = review
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    status = "error",
                    message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "An unexpected error occurred while submitting the review",
                    details = ex.Message
                });
            }
        }

        [HttpPost("test")]
        public async Task<IActionResult> TestReview([FromBody] AddReviewRequestDTO request)
        {
            return Ok(new
            {
                status = "success",
                message = "Test endpoint",
                receivedData = new
                {
                    UserId = request?.UserId,
                    ProductId = request?.ProductId,
                    Rating = request?.Rating,
                    Comment = request?.Comment
                }
            });
        }

        [HttpGet("debug/products")]
        public async Task<IActionResult> GetProductsForDebug()
        {
            try
            {
                var products = await _productRepository.GetAllAsync();
                return Ok(new
                {
                    status = "success",
                    message = "Products retrieved for debugging",
                    data = products.Take(5).Select(p => new { p.ProductId, p.Name }).ToList()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Error retrieving products",
                    details = ex.Message
                });
            }
        }

        [HttpGet("debug/users")]
        public async Task<IActionResult> GetUsersForDebug()
        {
            try
            {
                var users = await _userRepository.GetAllAsync();
                return Ok(new
                {
                    status = "success",
                    message = "Users retrieved for debugging",
                    data = users.Take(5).Select(u => new { u.UserId, u.Email }).ToList()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Error retrieving users",
                    details = ex.Message
                });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewRequestDTO request)
        {
            if (request.Rating < 1 || request.Rating > 5)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Rating phải từ 1 đến 5."
                });
            }

            var updatedReview = await _reviewRepository.UpdateReviewAsync(id, request);

            if (updatedReview == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Không tìm thấy đánh giá cần cập nhật."
                });
            }

            return Ok(new
            {
                status = "success",
                message = "Đánh giá đã được cập nhật.",
                data = updatedReview
            });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var success = await _reviewRepository.DeleteReviewAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Không tìm thấy đánh giá cần xoá."
                });
            }

            return Ok(new
            {
                status = "success",
                message = "Đánh giá đã được xoá."
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _reviewRepository.GetReviewByIdAsync(id);

            if (review == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Không tìm thấy đánh giá."
                });
            }

            return Ok(new
            {
                status = "success",
                message = "Lấy đánh giá thành công.",
                data = review
            });
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetReviewsByProductId(int productId)
        {
            try
            {
                var reviews = await _reviewRepository.GetReviewsByProductIdAsync(productId);
                var reviewDTOs = _mapper.Map<List<ReviewDTO>>(reviews);

                return Ok(new
                {
                    status = "success",
                    message = "Reviews retrieved successfully",
                    data = reviewDTOs
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Error retrieving reviews",
                    details = ex.Message
                });
            }
        }
    }
}