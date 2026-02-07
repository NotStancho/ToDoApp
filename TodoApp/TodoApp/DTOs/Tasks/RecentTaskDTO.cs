namespace TodoApp.DTOs.Tasks
{
    public class RecentTaskDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string? CategoryName { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
