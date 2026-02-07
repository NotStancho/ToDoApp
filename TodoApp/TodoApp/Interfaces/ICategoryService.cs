using TodoApp.DTOs.Categories;

namespace TodoApp.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryListDTO>> GetAllAsync(int userId);
        Task<CategoryDetailsDTO> GetByIdAsync(int userId, int categoryId);
        Task<CategoryDetailsDTO> CreateAsync(int userId, CategoryCreateDTO dto);
        Task <CategoryDetailsDTO> UpdateAsync(int userId, int categoryId, CategoryUpdateDTO dto);
        Task DeleteAsync(int userId, int categoryId);
    }
}
