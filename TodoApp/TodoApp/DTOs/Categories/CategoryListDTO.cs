namespace TodoApp.DTOs.Categories
{
    public class CategoryListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTimeOffset CreatedAt { get; set; }
    }
}
