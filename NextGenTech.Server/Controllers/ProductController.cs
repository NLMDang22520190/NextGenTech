using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.GET;

namespace HealthBuddy.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductController(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        [HttpGet("CustomerGetAllProduct")]
        public async Task<ActionResult> CustomerGetAllProduct()
        {
            try
            {
                var products = await _productRepository.CustomerGetAllProductAsync();
                return Ok(_mapper.Map<List<CustomerProductDTO>>(products));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("CustomerGetProductById/{id}")]
        public async Task<ActionResult> CustomerGetProductById(int id)
        {
            try
            {
                var product = await _productRepository.CustomerGetProductByIdAsync(id);
                return Ok(_mapper.Map<CustomerDetailProductDTO>(product));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


    }

}