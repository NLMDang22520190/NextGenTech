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

    }
}