using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Categories
{
    public class CategoryCreateDTO
    {
        [Required(ErrorMessage = "Category name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2–100 characters")]
        public string Name { get; set; } = null!;
    }
}
