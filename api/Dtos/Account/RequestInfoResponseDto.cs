using api.Dtos.Common;

namespace api.Dtos.Account
{
    public class RequestInfoResponseDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? EnrollmentCode { get; set; }
        public string? StudentIdCard { get; set; }
        public string? StudentDob { get; set; }
        public string? StudentEthnicity { get; set; }
        public string? StudentGender { get; set; }
        public string? StudentAvatar { get; set; }
        public string? StudentContactProvince { get; set; }
        //public string? StudentContactDistrict { get; set; }
        public string? StudentContactWard { get; set; }
        public string? StudentContactAddress { get; set; }
        public string? StudentFullContactAddress { get; set; }
        public string? HighSchoolProvince { get; set; }
        public string? HighSchoolWard { get; set; }
        public string? HighSchool { get; set; }
        public string? HighSchoolAcademicPerformance { get; set; }
        public string? HighSchoolConduct { get; set; }
        public int? HighSchoolGraduationYear { get; set; }
        public string? AspirationMajor { get; set; }
        public string? AspirationExamGroup { get; set; }
        public string? AspirationAdmissionMethod { get; set; }
        public decimal? AspirationSubject1Score { get; set; }
        public decimal? AspirationSubject2Score { get; set; }
        public decimal? AspirationSubject3Score { get; set; }
        public bool? AspirationConfirmation { get; set; }
        public string? TrainingSystemType { get; set; }
        public string? EnrollmentStatus { get; set; }
        public string? UniversityMajor { get; set; }
        public decimal? UniversityGpa { get; set; }
        public int? UniversityGraduationYear { get; set; }
        public string? UniversitySignDate { get; set; }
        public string? UniversityTrainingMode { get; set; }
        public string? UniversityDegreeNumber { get; set; }
        public string? UniversityRegistrationNumber { get; set; }
        public string? UniversityName { get; set; }
        public string? UniversityEducationLevel { get; set; }
        public int? UniversityYearOfAdmission { get; set; }
        public string? Role { get; set; }
    }
}