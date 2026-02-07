using TodoApp.DTOs.Users;

namespace TodoApp.Interfaces
{
    public interface IUserService
    {
        Task<TokenPair> RegisterAsync(RegisterDTO dto);
        Task<TokenPair> LoginAsync(LoginDTO dto);
        Task<TokenPair> RefreshTokenAsync(string refreshToken);

        Task LogoutAsync(string refreshToken);

        Task<UserDTO> GetMeAsync(int userId);
    }
}
