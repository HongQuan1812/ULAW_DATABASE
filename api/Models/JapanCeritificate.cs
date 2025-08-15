using System;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class JapanCertificate
    {
        public string? JapanCertificateName { get; set; }

        public string? JapanCertificateDate { get; set; }

        public decimal? JapanCertificateListeningScore { get; set; }

        public decimal? JapanCertificateReadingScore { get; set; }

        public decimal? JapanCertificateVocabularyScore { get; set; }

        public decimal? JapanCertificateTotalScore { get; set; }

        public string? JapanCertificateLevel { get; set; }

        public string? JapanCertificateFilePath { get; set; }
    }
}