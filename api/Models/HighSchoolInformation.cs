using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class HighSchoolInformation
    {
        [Required(ErrorMessage = "Tỉnh/Thành phố thí sinh học là bắt buộc")]
        public string HighSchoolProvince { get; set; }

        [Required(ErrorMessage = "Phường/Xã thí sinh học là bắt buộc")]
        public string HighSchoolWard { get; set; }

        [Required(ErrorMessage = "Trường THPT thí sinh học là bắt buộc")]
        public string HighSchool { get; set; }

        [Required(ErrorMessage = "Học lực lớp 12 là bắt buộc")]
        public string HighSchoolAcademicPerformance { get; set; }

        [Required(ErrorMessage = "Hạnh kiểm lớp 12 là bắt buộc")]
        public string HighSchoolConduct { get; set; }

        [Required(ErrorMessage = "Năm tốt nghiệm THPT là bắt buộc")]
        [Range(1900, 3000, ErrorMessage = "Năm tốt nghiệp không hợp lệ")]
        public int HighSchoolGraduationYear { get; set; }
    }
}