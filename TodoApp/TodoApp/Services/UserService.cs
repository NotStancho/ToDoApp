using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TodoApp.Data;
using TodoApp.DTOs.Users;
using TodoApp.Interfaces;
using TodoApp.Data.Entities;

namespace TodoApp.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private readonly AppDbContext _db;

        public UserService(UserManager<User> userManager, IConfiguration config, AppDbContext db)
        {
            _userManager = userManager;
            _config = config;
            _db = db;
        }

        public async Task<TokenPair> RegisterAsync(RegisterDTO dto)
        {
            var user = new User
            {
                Email = dto.Email,
                UserName = dto.Email,
                Nickname = dto.Nickname,
                CreatedAt = DateTimeOffset.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                throw new InvalidOperationException(string.Join("; ", result.Errors.Select(e => e.Description)));

            return await GenerateTokensAsync(user);
        }

        public async Task<TokenPair> LoginAsync(LoginDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email)
                ?? throw new UnauthorizedAccessException("Invalid credentials");

            if (!await _userManager.CheckPasswordAsync(user, dto.Password))
                throw new UnauthorizedAccessException("Invalid credentials");

            return await GenerateTokensAsync(user);
        }

        public async Task<TokenPair> RefreshTokenAsync(string refreshToken)
        {
            var token = await _db.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t =>
                    t.Token == refreshToken &&
                    !t.IsRevoked &&
                    t.ExpiresAt > DateTime.UtcNow)
                ?? throw new UnauthorizedAccessException("Invalid refresh token");

            token.IsRevoked = true;
            await _db.SaveChangesAsync();

            return await GenerateTokensAsync(token.User);
        }

        public async Task LogoutAsync(string refreshToken)
        {
            var token = await _db.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == refreshToken && !t.IsRevoked);

            if (token == null)
                return;

            token.IsRevoked = true;
            await _db.SaveChangesAsync();
        }

        public async Task<UserDTO> GetMeAsync(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new UnauthorizedAccessException("User not found");

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email!,
                Nickname = user.Nickname
            };
        }

        private async Task<TokenPair> GenerateTokensAsync(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpiresMinutes"]!)
            );

            var jwt = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email!)
                },
                expires: expires,
                signingCredentials: creds
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwt);
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            _db.RefreshTokens.Add(new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(14)
            });

            await _db.SaveChangesAsync();

            return new TokenPair(
                accessToken, 
                expires, 
                refreshToken,
                new UserDTO { 
                    Id = user.Id,
                    Email = user.Email!,
                    Nickname = user.Nickname
                });
        }
    }
}
