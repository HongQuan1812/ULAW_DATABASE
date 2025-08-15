using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace api.Models
{
    [Index(nameof(EnrollmentCode), IsUnique = true)]
    public class Summarization
    {
        [ForeignKey("AppUser")]
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        [Key]
        public string EnrollmentCode { get; set; }
        public string? StudentFirstName { get; set; }
        public string? StudentLastName { get; set; }
        public string? StudentPhone { get; set; }
        public string? StudentEmail { get; set; }

        [Required(ErrorMessage = "Thông tin cá nhân là bắt buộc")]
        public StudentInformation StudentInfor { get; set; }
        public HighSchoolInformation? HighSchoolInfor { get; set; }

        public UniversityInformation? UniversityInfor { get; set; }

        [Required(ErrorMessage = "Thông tin liên hệ là bắt buộc")]
        public ContactInformation ContactInfor { get; set; }

        public HighStudyInformation? HighStudyInfor { get; set; }
        public string? WorkPlace { get; set; }
        public string? FeeFile { get; set; }

        [Required(ErrorMessage = "Ngành đăng ký là bắt buộc")]
        public string AspirationMajor { get; set; }

        public string? AspirationExamGroup { get; set; }

        public string? AspirationAdmissionMethod { get; set; }

        [Range(0.0, 10.0, ErrorMessage = "Điểm phải từ  0.0 đến 10.0")]
        public decimal? AspirationSubject1Score { get; set; }

        [Range(0.0, 10.0, ErrorMessage = "Điểm phải từ  0.0 đến 10.0")]
        public decimal? AspirationSubject2Score { get; set; }

        [Range(0.0, 10.0, ErrorMessage = "Điểm phải từ  0.0 đến 10.0")]
        public decimal? AspirationSubject3Score { get; set; }

        [Required(ErrorMessage = "Xác nhận thông tin là bắt buộc")]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Vui lòng xác nhận thông tin")]
        public bool AspirationConfirmation { get; set; }

        [Required(ErrorMessage = "Hệ đào tạo là bắt buộc")]
        public string TrainingSystemType { get; set; }

        public string EducationType { get; set; }

        public EnglishCertificate? EnglishCertificate { get; set; }

        public FranceCertificate? FranceCertificate { get; set; }

        public JapanCertificate? JapanCertificate { get; set; }

        public DateTime RegisDate { get; set; }

        public string? EditDate { get; set; }

        public int? Step { get; set; }

        public string? AdminMess { get; set; }

        public string? AdminProcessTime { get; set; }

        public string? AdminName { get; set; }

        public string? AdminUsername { get; set; }

        public string? AdminRole { get; set; }
    }
}