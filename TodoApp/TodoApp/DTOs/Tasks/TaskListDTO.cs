namespace TodoApp.DTOs.Tasks
{
    public class TaskListDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public bool IsCompleted { get; set; }

        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; } = null!;

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
