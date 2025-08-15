using System;
using api.Models;

namespace api.Dtos.Enrollment
{
    public class AdminEnrollManagementDto
    {
        public string EnrollmentCode { get; set; }
        public string AppUserId { get; set; }
        public string TrainingSystemType { get; set; }
        public string EducationType { get; set; }
        public string StudentAvatar { get; set; }
        public string RegisDate { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public string StudentPhone { get; set; }
        public string StudentEmail { get; set; }
        public StudentInformation StudentInfor { get; set; }
        public HighSchoolInformation HighSchoolInfor { get; set; }
        public UniversityInformation? UniversityInfor { get; set; }
        public ContactInformation ContactInfor { get; set; }
        public EnglishCertificate? EnglishCertificate { get; set; }
        public FranceCertificate? FranceCertificate { get; set; }
        public JapanCertificate? JapanCertificate { get; set; }
        public HighStudyInformation? HighStudyInfor { get; set; }
        public string AspirationMajor { get; set; }
        public string? AspirationExamGroup { get; set; }
        public string? AspirationAdmissionMethod { get; set; }
        public decimal? AspirationSubject1Score { get; set; }
        public decimal? AspirationSubject2Score { get; set; }
        public decimal? AspirationSubject3Score { get; set; }
        public string? FeeFile { get; set; }
        public string? WorkPlace { get; set; }
        public string? EditDate { get; set; }
        public string? AdminName { get; set; }
        public string? AdminUsername { get; set; }
        public string? AdminProcessTime { get; set; }
        public int? Step { get; set; }
        public string? AdminMess { get; set; }
        public string? AdminRole { get; set; }
    }
}