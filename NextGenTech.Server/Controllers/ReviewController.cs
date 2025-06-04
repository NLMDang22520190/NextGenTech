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
        private readonly IMapper _mapper;
        private readonly IReviewRepository _reviewRepository;

        public ReviewController(IUserRepository userRepository, IMapper mapper, IReviewRepository reviewRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _reviewRepository = reviewRepository;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddReview([FromBody] AddReviewRequestDTO request)
        {
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
                    message = "Review has been submitted",
                    data = review
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = "Error submitting review",
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