using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class FranceCertificate
    {
        public string? FranceCertificateName { get; set; }

        public string? FranceCertificateDate { get; set; }
        
        public decimal? FranceCertificateListeningScore { get; set; }

        public decimal? FranceCertificateReadingScore { get; set; }

        public decimal? FranceCertificateWritingScore { get; set; }

        public decimal? FranceCertificateSpeakingScore { get; set; }

        public decimal? FranceCertificateTotalScore { get; set; }

        public string? FranceCertificateLevel { get; set; }

        public string? FranceCertificateFilePath { get; set; }
    }
}