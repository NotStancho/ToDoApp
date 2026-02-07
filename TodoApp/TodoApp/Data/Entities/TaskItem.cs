namespace TodoApp.Data.Entities;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
