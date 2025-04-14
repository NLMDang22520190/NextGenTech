using AutoMapper;
using NextGenTech.Server.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextGenTech.Server.Models.DTO.GET;
using NextGenTech.Server.Models.DTO.ADD;
using NextGenTech.Server.Models.Domain;

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

        [HttpGet("AdminGetAllProduct")]
        public async Task<ActionResult> AdminGetAllProduct()
        {
            try
            {
                var products = await _productRepository.AdminGetAllProductAsync();
                if (products == null || products.Count == 0)
                {
                    return NotFound("No products found");
                }
                return Ok(_mapper.Map<List<AdminProductDTO>>(products));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("AdminGetProductById/{id}")]
        public async Task<ActionResult> AdminGetProductById(int id)
        {
            try
            {
                var product = await _productRepository.AdminGetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound("Product not found");
                }
                return Ok(_mapper.Map<AdminDetailProductDTO>(product));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("GetProductImagesByProductId/{productId}")]
        public async Task<ActionResult> GetProductImagesByProductId(int productId)
        {
            try
            {
                var productImages = await _productRepository.GetProductImagesByProductIdAsync(productId);
                if (productImages == null || productImages.Count == 0)
                {
                    return NotFound("No images found for this product.");
                }
                return Ok(productImages);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("GetProductColorsByProductId/{productId}")]
        public async Task<ActionResult> GetProductColorsByProductId(int productId)
        {
            try
            {
                var productColors = await _productRepository.GetProductColorsByProductIdAsync(productId);
                if (productColors == null || productColors.Count == 0)
                {
                    return NotFound("No colors found for this product.");
                }
                return Ok(productColors);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("AddProduct")]
        public async Task<ActionResult> AddProduct([FromBody] AdminAddProductDTO adminAddProductDTO)
        {
            try
            {
                var product = _mapper.Map<Product>(adminAddProductDTO);
                int productId = (await _productRepository.AddProductAsync(product)).ProductId;

                var productImages = adminAddProductDTO.ImageUrls.Select(url => new ProductImage
                {
                    ProductId = productId,
                    ImageUrl = url
                }).ToList();
                await _productRepository.AddProductImagesAsync(productImages);

                var productColors = adminAddProductDTO.Colors.Select(color => new ProductColor
                {
                    ProductId = productId,
                    Color = color.Color,
                    ColorCode = color.ColorCode,
                    StockQuantity = color.StockQuantity
                }).ToList();
                await _productRepository.AddProductColorsAsync(productColors);

                return Ok(AdminGetProductById(productId));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("DeleteProduct/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            try
            {
                var deletedProduct = await _productRepository.DeleteProductAsync(id);
                if (deletedProduct == null)
                {
                    return NotFound("Product not found.");
                }

                return Ok("Product deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }

}