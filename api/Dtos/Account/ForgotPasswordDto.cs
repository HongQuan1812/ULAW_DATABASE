using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Account
{
    public class ForgotPasswordRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}