using api.Models;

namespace api.Dtos.Update
{
    public class UpdateVanBang2Dto : BaseEnrollmentUpdateDto
    {
        public HighSchoolInforUpdateDto? HighSchoolInfor { get; set; }
        public UniversityInformation? UniversityInfor { get; set; }
        public FranceCertificate? FranceCertificate { get; set; }
        public JapanCertificate? JapanCertificate { get; set; }
    }
}