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
    public class BrandController : ControllerBase
    {
        private readonly IBrandRepository _brandRepository;
        private readonly IMapper _mapper;

        public BrandController(IBrandRepository brandRepository, IMapper mapper)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
        }

        [HttpGet("GetAllBrand")]
        public async Task<ActionResult> GetAllBrand()
        {
            try
            {
                var brands = await _brandRepository.GetAllAsync();
                return Ok(_mapper.Map<List<BrandDTO>>(brands));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("AdminGetAllBrand")]
        public async Task<ActionResult> AdminGetAllBrand()
        {
            try
            {
                var brands = await _brandRepository.AdminGetAllBrandAsync();
                return Ok(_mapper.Map<List<AdminBrandDTO>>(brands));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("AddBrand")]
        public async Task<ActionResult> AddBrand([FromBody] AdminAddBrandDTO adminAddBrandDTO)
        {
            try
            {
                var brand = _mapper.Map<Brand>(adminAddBrandDTO);
                var addedBrand = await _brandRepository.AddBrandAsync(brand);
                return Ok(addedBrand);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        
        [HttpPut("UpdateBrand/{brandId}")]
        public async Task<ActionResult> UpdateBrand(int brandId, [FromBody] AdminUpdateBrandDTO adminUpdateBrandDTO)
        {
            try
            {
                if (adminUpdateBrandDTO == null)
                {
                    return BadRequest("Invalid brand data");
                }
                var updatedBrand = _mapper.Map<Brand>(adminUpdateBrandDTO);
                var brand = await _brandRepository.UpdateBrandAsync(brandId, updatedBrand);
                if (brand == null)
                {
                    return NotFound("Brand not found");
                }
                return Ok(await _brandRepository.GetByIdAsync(p => p.BrandId == brandId));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("DeleteBrand/{brandId}")]
        public async Task<ActionResult> DeleteBrand(int brandId)
        {
            try
            {
                var deletedBrand = await _brandRepository.DeleteBrandAsync(brandId);
                if (deletedBrand == null)
                {
                    return NotFound("Brand not found");
                }
                return Ok(deletedBrand);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}