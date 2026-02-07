namespace TodoApp.DTOs.Categories
{
    public class CategoryDetailsDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
    }
}
