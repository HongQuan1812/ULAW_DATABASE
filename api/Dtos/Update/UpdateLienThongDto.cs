using api.Models;

namespace api.Dtos.Update
{
    public class UpdateLienThongDto : BaseEnrollmentUpdateDto
    {
        public HighSchoolInforUpdateDto? HighSchoolInfor { get; set; }
        public UniversityInformation? UniversityInfor { get; set; }
        public FranceCertificate? FranceCertificate { get; set; }
        public JapanCertificate? JapanCertificate { get; set; }
    }
}