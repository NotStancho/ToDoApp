namespace TodoApp.DTOs.Users
{
    public record TokenPair(
        string AccessToken,
        DateTime ExpiresAt,
        string RefreshToken,
        UserDTO User
    );
}
