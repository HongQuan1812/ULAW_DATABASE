using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    [Index(nameof(EnrollmentCode), IsUnique = true)]
    public class DaiHocEnrollment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FormId { get; set; }

        public string? EnrollmentCode { get; set; }

        public string? StudentFirstName { get; set; }
        public string? StudentLastName { get; set; }
        public string? StudentPhone { get; set; }
        public string? StudentEmail { get; set; }

        [Required(ErrorMessage = "Thông tin cá nhân là bắt buộc")]
        public StudentInformation StudentInfor { get; set; }

        [Required(ErrorMessage = "Thông tin trường THPT là bắt buộc")]
        public HighSchoolInformation HighSchoolInfor { get; set; }

        [Required(ErrorMessage = "Thông tin liên hệ là bắt buộc")]
        public ContactInformation ContactInfor { get; set; }

        [Required(ErrorMessage = "Ngành đăng ký là bắt buộc")]
        public string AspirationMajor { get; set; }

        [Required(ErrorMessage = "Tổ hợp xét tuyển là bắt buộc")]
        public string AspirationExamGroup { get; set; }

        [Required(ErrorMessage = "Phương thức xét tuyển là bắt buộc")]
        public string AspirationAdmissionMethod { get; set; }

        [Required(ErrorMessage = "Điểm môn 1 là bắt buộc")]
        [Range(0.0, 10.0, ErrorMessage = "Điểm phải từ  0.0 đến 10.0")]
        public decimal AspirationSubject1Score { get; set; }

        [Required(ErrorMessage = "Điểm môn 2 là bắt buộc")]
        [Range(0.0, 10.0, ErrorMessage = "Điểm phải từ  0.0 đến 10.0")]
        public decimal AspirationSubject2Score { get; set; }

        [Required(ErrorMessage = "Điểm môn 3 là bắt buộc")]
        [Range(0.0, 10.0, ErrorMessage = "Điểm phải từ  0.0 đến 10.0")]
        public decimal AspirationSubject3Score { get; set; }

        [Required(ErrorMessage = "Xác nhận thông tin là bắt buộc")]
        [Range(typeof(bool), "true", "true", ErrorMessage = "Vui lòng xác nhận thông tin")]
        public bool AspirationConfirmation { get; set; }

        public EnglishCertificate? EnglishCertificate { get; set; }

        public FranceCertificate? FranceCertificate { get; set; }

        public JapanCertificate? JapanCertificate { get; set; }

        [Required(ErrorMessage = "Hệ đào tạo là bắt buộc")]
        public string TrainingSystemType { get; set; }

        public string? EditDate { get; set; }

        public int? Step { get; set; }

        public string? AdminMess { get; set; }

        public string? AdminProcessTime { get; set; }

        public string? AdminName { get; set; }

        public string? AdminUsername { get; set; }
    }
}