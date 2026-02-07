using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Tasks
{
    public class TaskUpdateDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 200 characters")]
        public string Title { get; set; } = null!;

        [StringLength(2000, ErrorMessage = "Description must be at most 2000 characters")]
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }

        public int? CategoryId { get; set; }
    }
}
