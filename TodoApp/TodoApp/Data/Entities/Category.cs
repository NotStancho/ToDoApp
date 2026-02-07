namespace TodoApp.Data.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}