using api.Dtos.Common;

namespace api.Dtos.Account
{
    public class LoginResponseDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? StudentAvatar { get; set; }
        public string? Role { get; set; }
    }
}