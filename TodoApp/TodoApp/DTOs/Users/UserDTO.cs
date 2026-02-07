namespace TodoApp.DTOs.Users
{
    public class UserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string Nickname { get; set; } = null!;
    }
}
