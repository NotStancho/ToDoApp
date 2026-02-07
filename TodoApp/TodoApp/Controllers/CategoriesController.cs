using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.DTOs.Categories;
using TodoApp.Interfaces;

namespace TodoApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : BaseController
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllAsync(UserId);
            return Ok(categories);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _categoryService.GetByIdAsync(UserId, id);
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(CategoryCreateDTO dto)
        {
            var category = await _categoryService.CreateAsync(UserId, dto);
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }
        
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, CategoryUpdateDTO dto)
        {
            var updated = await _categoryService.UpdateAsync(UserId, id, dto);
            return Ok(updated);
        }
        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            await _categoryService.DeleteAsync(UserId, id);
            return NoContent();
        }
    }
}
