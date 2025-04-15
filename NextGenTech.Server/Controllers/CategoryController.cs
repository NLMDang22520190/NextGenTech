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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        [HttpGet("GetAllCategory")]
        public async Task<ActionResult> GetAllCategory()
        {
            try
            {
                var categories = await _categoryRepository.GetAllAsync();
                return Ok(_mapper.Map<List<CategoryDTO>>(categories));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("AdminGetAllCategory")]
        public async Task<ActionResult> AdminGetAllCategory()
        {
            try
            {
                var categories = await _categoryRepository.AdminGetAllCategoryAsync();
                return Ok(_mapper.Map<List<AdminCategoryDTO>>(categories));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("AddCategory")]
        public async Task<ActionResult> AddCategory([FromBody] AdminAddCategoryDTO adminAddCategoryDTO)
        {
            try
            {
                if (adminAddCategoryDTO == null)
                {
                    return BadRequest("Invalid category data.");
                }
                var category = _mapper.Map<Category>(adminAddCategoryDTO);
                var addedCategory = await _categoryRepository.AddCategoryAsync(category);
                return Ok(_mapper.Map<AdminCategoryDTO>(addedCategory));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("UpdateCategory/{categoryId}")]
        public async Task<ActionResult> UpdateCategory(int categoryId, [FromBody] AdminUpdateCategoryDTO adminUpdateCategoryDTO)
        {
            try
            {
                if (adminUpdateCategoryDTO == null)
                {
                    return BadRequest("Invalid category data.");
                }
                var updatedCategory = _mapper.Map<Category>(adminUpdateCategoryDTO);
                var result = await _categoryRepository.UpdateCategoryAsync(categoryId, updatedCategory);
                if (result == null)
                {
                    return NotFound("Category not found.");
                }
                return Ok(await _categoryRepository.GetByIdAsync(p => p.CategoryId == categoryId));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("DeleteCategory/{categoryId}")]
        public async Task<ActionResult> DeleteCategory(int categoryId)
        {
            try
            {
                var deletedCategory = await _categoryRepository.DeleteCategoryAsync(categoryId);
                if (deletedCategory == null)
                {
                    return NotFound("Category not found.");
                }
                return Ok(_mapper.Map<AdminCategoryDTO>(deletedCategory));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}