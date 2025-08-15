using api.Models;

namespace api.Dtos.Update
{
    public class BaseEnrollmentUpdateDto
    {
        public string EnrollmentCode { get; set; } = null!;
        public string? StudentFirstName { get; set; }
        public string? StudentLastName { get; set; }
        public string? StudentPhone { get; set; }
        public string? StudentEmail { get; set; }
        public string? TrainingSystemType { get; set; }
        public string? AspirationMajor { get; set; }

        public StudentInforUpdateDto? StudentInfor { get; set; }
        public ContactInformation? ContactInfor { get; set; }
        public EnglishCertificate? EnglishCertificate { get; set; }
    }
}
