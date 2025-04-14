using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.GET;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionRepository _promotionRepository;
        private readonly IMapper _mapper;

        public PromotionController(IPromotionRepository promotionRepository, IMapper mapper)
        {
            _promotionRepository = promotionRepository;
            _mapper = mapper;
        }

        [HttpGet("CustomerGetAllAvailablePromotion")]
        public async Task<ActionResult> CustomerGetAllAvailablePromotion()
        {
            try
            {
                var promotions = await _promotionRepository.CustomerGetAllAvailablePromotionAsync();
                return Ok(_mapper.Map<List<CustomerPromotionDTO>>(promotions));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("AdminGetAllPromotions")]
        public async Task<ActionResult> AdminGetAllPromotions()
        {
            try
            {
                var promotions = await _promotionRepository.GetAllAsync();
                if (promotions == null || promotions.Count == 0)
                {
                    return NotFound("No promotions found");
                }
                return Ok(_mapper.Map<List<AdminPromotionDTO>>(promotions));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("AdminGetPromotionById/{id}")]
        public async Task<ActionResult> AdminGetPromotionById(int id)
        {
            try
            {
                var promotion = await _promotionRepository.AdminGetPromotionByIdAsync(id);
                if (promotion == null)
                {
                    return NotFound("Promotion not found");
                }
                return Ok(_mapper.Map<AdminPromotionDTO>(promotion));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}