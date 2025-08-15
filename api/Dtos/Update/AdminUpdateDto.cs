using api.Models;

namespace api.Dtos.Update
{
    public class AdminUpdateDto
    {
        public string EnrollmentCode { get; set; } = null!;
        public int? Step { get; set; }
        public string? AdminMess { get; set; }
        public string? AdminName { get; set; }
        public string? AdminUsername { get; set; }
    }
}
