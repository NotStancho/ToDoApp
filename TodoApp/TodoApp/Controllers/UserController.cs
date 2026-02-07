using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApp.DTOs.Users;
using TodoApp.Interfaces;

namespace TodoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var pair = await _userService.RegisterAsync(dto);

            SetRefreshCookie(pair.RefreshToken);

            return Ok(new AuthResponseDTO
            {
                AccessToken = pair.AccessToken,
                ExpiresAt = pair.ExpiresAt,
                User = pair.User
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var pair = await _userService.LoginAsync(dto);

            SetRefreshCookie(pair.RefreshToken);

            return Ok(new AuthResponseDTO
            {
                AccessToken = pair.AccessToken,
                ExpiresAt = pair.ExpiresAt,
                User = pair.User
            });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refresh_token"]
                ?? throw new UnauthorizedAccessException("Missing refresh token");

            var pair = await _userService.RefreshTokenAsync(refreshToken);

            SetRefreshCookie(pair.RefreshToken);

            return Ok(new AuthResponseDTO
            {
                AccessToken = pair.AccessToken,
                ExpiresAt = pair.ExpiresAt,
                User = pair.User
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var me = await _userService.GetMeAsync(UserId);
            return Ok(me);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refresh_token"];
            if(refreshToken != null)
                await _userService.LogoutAsync(refreshToken);

            Response.Cookies.Delete("refresh_token");
            return NoContent();
        }

        private void SetRefreshCookie(string token)
        {
            Response.Cookies.Append("refresh_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddDays(14)
            });
        }
    }
}
