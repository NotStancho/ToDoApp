using Microsoft.AspNetCore.Identity;

namespace TodoApp.Data.Entities;

public class User : IdentityUser<int>
{
    public string Nickname { get; set; } = null!;
    public DateTimeOffset CreatedAt { get; set; }
}