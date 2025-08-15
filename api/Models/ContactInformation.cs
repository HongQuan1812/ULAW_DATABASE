using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class ContactInformation
    {
        [Required(ErrorMessage = "Tỉnh/Thành phố liên hệ là bắt buộc")]
        public string StudentContactProvince { get; set; }

        [Required(ErrorMessage = "Phường/Xã liên hệ là bắt buộc")]
        public string StudentContactWard { get; set; }

        [Required(ErrorMessage = "Địa chỉ thường trú là bắt buộc")]
        public string StudentContactAddress { get; set; }

        [Required(ErrorMessage = "Địa chỉ liên hệ là bắt buộc")]
        public string StudentFullContactAddress { get; set; }

        public string? FatherName { get; set; }

        public string? FatherPhone { get; set; }

        public string? FatherOccupation { get; set; }

        public string? MotherName { get; set; }

        public string? MotherPhone { get; set; }

        public string? MotherOccupation { get; set; }
    }
}