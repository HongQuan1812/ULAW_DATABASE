using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class StudentInformation
    {
        [Required(ErrorMessage = "CCCD/Mã định danh là bắt buộc")]
        public string StudentIdCard { get; set; }

        [Required(ErrorMessage = "Ngày tháng năm sinh là bắt buộc")]
        public string StudentDob { get; set; }

        [Required(ErrorMessage = "Dân tộc là bắt buộc")]
        public string StudentEthnicity { get; set; }

        [Required(ErrorMessage = "Giới tính là bắt buộc")]
        public string StudentGender { get; set; }
        
        public string StudentAvatar { get; set; }
    }
}