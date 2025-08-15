using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        [Required(ErrorMessage = "Tên là bắt buộc.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Họ là bắt buộc.")]
        public string LastName { get; set; }
        public string Role { get; set; } = "user";
        public ICollection<Summarization> Summarization { get; set; } = new List<Summarization>();
    }
}