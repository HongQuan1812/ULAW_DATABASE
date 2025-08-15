using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Account
{
    public class RegisterRequestDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Role { get; set; }
    }
}