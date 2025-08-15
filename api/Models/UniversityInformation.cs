using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class UniversityInformation
    {
        public string? UniversityMajor { get; set; }

        [Range(0.0, 10.0, ErrorMessage = "GPA phải từ 0.0 đến 10.0")]
        public decimal? UniversityGpa { get; set; }

        public string? UniversityScoreType { get; set; }

        [Range(1900, 3000, ErrorMessage = "Năm tốt nghiệp không hợp lệ")]
        public int? UniversityGraduationYear { get; set; }

        public string? UniversitySignDate { get; set; }

        public string? UniversityTrainingMode { get; set; }

        public string? UniversityDegreeNumber { get; set; }

        public string? UniversityRegistrationNumber { get; set; }

        public string? UniversityName { get; set; }

        public string? UniversityGraduateDegree { get; set; }

        public string? UniversityDegree { get; set; }
    }
}