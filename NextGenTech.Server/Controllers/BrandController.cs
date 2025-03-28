using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.GET;

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

    }
}