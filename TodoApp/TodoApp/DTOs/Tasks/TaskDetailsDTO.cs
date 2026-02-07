namespace TodoApp.DTOs.Tasks
{
    public class TaskDetailsDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }

        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
