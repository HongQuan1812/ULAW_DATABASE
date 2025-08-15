using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class EnglishCertificate
    {
        public string? EnglishCertificateName { get; set; }

        public string? EnglishCertificateDate { get; set; }

        public string? EnglishCertificateNumber { get; set; }

        public decimal? EnglishCertificateListeningScore { get; set; }

        public decimal? EnglishCertificateReadingScore { get; set; }

        public decimal? EnglishCertificateWritingScore { get; set; }

        public decimal? EnglishCertificateSpeakingScore { get; set; }

        public decimal? EnglishCertificateTotalScore { get; set; }

        public string? EnglishCertificateLevel { get; set; }

        public string? EnglishCertificateFilePath { get; set; }
    }
}