using api.Models;

namespace api.Dtos.Update
{
    public class UpdateDaiHocDto : BaseEnrollmentUpdateDto
    {
        public HighSchoolInforUpdateDto? HighSchoolInfor { get; set; }
        public string? AspirationExamGroup { get; set; }
        public string? AspirationAdmissionMethod { get; set; }
        public decimal? AspirationSubject1Score { get; set; }
        public decimal? AspirationSubject2Score { get; set; }
        public decimal? AspirationSubject3Score { get; set; }
        public FranceCertificate? FranceCertificate { get; set; }
        public JapanCertificate? JapanCertificate { get; set; }
    }
}