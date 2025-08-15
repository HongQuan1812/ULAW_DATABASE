using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class SauDaiHocEnrollment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FormId { get; set; }

        public string? EnrollmentCode { get; set; }

        public string? StudentFirstName { get; set; }
        public string? StudentLastName { get; set; }
        public string? StudentPhone { get; set; }
        public string? StudentEmail { get; set; }

        [Required(ErrorMessage = "Thông tin cá nhân là bắt buộc.")]
        public StudentInformation StudentInfor { get; set; }

        [Required(ErrorMessage = "Thông tin liên hệ là bắt buộc.")]
        public ContactInformation ContactInfor { get; set; }

        [Required(ErrorMessage = "Thông tin Đại học là bắt buộc.")]
        public UniversityInformation UniversityInfor { get; set; }

        [Required(ErrorMessage = "Thông tin Cao học là bắt buộc")]
        public HighStudyInformation HighStudyInfor { get; set; }

        [Required(ErrorMessage = "Thông tin Chứng chỉ Tiếng Anh là bắt buộc")]
        public EnglishCertificate EnglishCertificate { get; set; }

        [Required(ErrorMessage = "Xác nhận là bắt buộc.")]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Vui lòng xác nhận thông tin.")]
        public bool AspirationConfirmation { get; set; }
        public string TrainingSystemType { get; set; }
        public string? EducationType { get; set; }
        public string WorkPlace { get; set; }
        public string FeeFile { get; set; }
        public string AspirationMajor { get; set; }

        public string? EditDate { get; set; }

        public int? Step { get; set; }

        public string? AdminMess { get; set; }

        public string? AdminProcessTime { get; set; }

        public string? AdminName { get; set; }

        public string? AdminUsername { get; set; }
    }
}