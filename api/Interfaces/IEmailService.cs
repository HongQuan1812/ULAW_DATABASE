using api.Models;

namespace api.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
        Task SendEmailWithCustomSettingsAsync(string toEmail, string subject, string message, SmtpSettings smtpSettings);
        Task SendEmailByEnrollmentCodeAsync(string enrollmentCode, string toEmail, string subject, string message);
    }
}