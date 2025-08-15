using System;

namespace api.Dtos.Enrollment
{
    public class RegistrationSummaryDto
    {
        public string EnrollmentCode { get; set; }
        public string TrainingSystemType { get; set; }
        public string RegisDate { get; set; }
        public int? Step { get; set; }
        public string? AdminMess { get; set; }
        public string? AdminName { get; set; }
    }
}