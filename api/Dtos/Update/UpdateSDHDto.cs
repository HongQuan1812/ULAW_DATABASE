using api.Models;

namespace api.Dtos.Update
{
    public class UpdateSDHDto : BaseEnrollmentUpdateDto
    {
        public HighStudyInformationDto? HighStudyInfor { get; set; }
        public UniversityInformation? UniversityInfor { get; set; }
        public string? FeeFile { get; set; }
        public string? WorkPlace { get; set; }
    }
}