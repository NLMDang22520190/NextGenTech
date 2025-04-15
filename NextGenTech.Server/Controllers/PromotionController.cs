using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.GET;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.Domain;
using NextGenTech.Server.Models.DTO.UPDATE;

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
                var promotions = await _promotionRepository.AdminGetAllPromotionsAsync();
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

        [HttpPost("AddPromotion")]
        public async Task<ActionResult> AddPromotion([FromBody] AdminAddPromotionDTO adminAddPromotionDTO)
        {
            try
            {
                if (adminAddPromotionDTO == null)
                {
                    return BadRequest("Invalid promotion data.");
                }
                var promotion = _mapper.Map<Promotion>(adminAddPromotionDTO);
                var addedPromotion = await _promotionRepository.AddPromotionAsync(promotion);
                await _promotionRepository.LinkProductsToPromotionAsync(addedPromotion, adminAddPromotionDTO.ProductIDs);
                return Ok(_mapper.Map<AdminPromotionDTO>(addedPromotion));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("UpdatePromotion/{id}")]
        public async Task<ActionResult> UpdatePromotion(int id, [FromBody] AdminUpdatePromotionDTO adminUpdatePromotionDTO)
        {
            try
            {
                if (adminUpdatePromotionDTO == null)
                {
                    return BadRequest("Invalid promotion data.");
                }
                var updatedPromotion = _mapper.Map<Promotion>(adminUpdatePromotionDTO);
                var promotion = await _promotionRepository.UpdatePromotionAsync(id, updatedPromotion);
                if (promotion == null)
                {
                    return NotFound("Promotion not found");
                }
                await _promotionRepository.LinkProductsToPromotionAsync(promotion, adminUpdatePromotionDTO.ProductIDs);
                return Ok(_mapper.Map<AdminPromotionDTO>(await _promotionRepository.AdminGetPromotionByIdAsync(id)));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("DeletePromotion/{id}")]
        public async Task<ActionResult> DeletePromotion(int id)
        {
            try
            {
                var promotion = await _promotionRepository.DeletePromotionAsync(id);
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