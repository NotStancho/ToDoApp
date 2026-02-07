using System.ComponentModel.DataAnnotations;

namespace TodoApp.DTOs.Users
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Nickname is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Nickname must be 2–50 characters")]
        public string Nickname { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = null!;
    }
}
