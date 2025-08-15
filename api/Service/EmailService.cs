using api.Interfaces;
using api.Models; // Sử dụng SmtpSettings
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace api.Service
{
    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtpSettings;
        private readonly IConfiguration _configuration;

        public EmailService(IOptions<SmtpSettings> smtpSettings, IConfiguration configuration)
        {
            _smtpSettings = smtpSettings.Value;
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            using (var client = new SmtpClient(_smtpSettings.Server, _smtpSettings.Port))
            {
                client.EnableSsl = _smtpSettings.EnableSsl;
                client.Credentials = new NetworkCredential(_smtpSettings.Username, _smtpSettings.Password);

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_smtpSettings.SenderEmail, _smtpSettings.SenderName),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                try
                {
                    await client.SendMailAsync(mailMessage);
                }
                catch (SmtpException ex)
                {
                    Console.WriteLine($"SMTP Error: {ex.StatusCode} - {ex.Message}");
                    throw new Exception("Error sending email via SMTP.", ex);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"General Email Error: {ex.Message}");
                    throw new Exception("Error sending email.", ex);
                }
            }
        }
        // ✅ Gửi email với cấu hình chỉ định
        public async Task SendEmailWithCustomSettingsAsync(string toEmail, string subject, string message, SmtpSettings smtpSettings)
        {
            using (var client = new SmtpClient(smtpSettings.Server, smtpSettings.Port))
            {
                client.EnableSsl = smtpSettings.EnableSsl;
                client.Credentials = new NetworkCredential(smtpSettings.Username, smtpSettings.Password);

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(smtpSettings.SenderEmail, smtpSettings.SenderName),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                try
                {
                    await client.SendMailAsync(mailMessage);
                }
                catch (SmtpException ex)
                {
                    Console.WriteLine($"SMTP Error: {ex.StatusCode} - {ex.Message}");
                    throw new Exception("Error sending email via SMTP.", ex);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"General Email Error: {ex.Message}");
                    throw new Exception("Error sending email.", ex);
                }
            }
        }

        // ✅ Gửi email động theo enrollmentCode
        public async Task SendEmailByEnrollmentCodeAsync(string enrollmentCode, string toEmail, string subject, string message)
        {
            var isSDH = enrollmentCode?.Contains("SDH", StringComparison.OrdinalIgnoreCase) == true;
            var sectionName = isSDH ? "SmtpAccounts:SDH" : "SmtpAccounts:Default";

            var dynamicSettings = _configuration.GetSection(sectionName).Get<SmtpSettings>();
            if (dynamicSettings == null)
            {
                throw new Exception($"Không tìm thấy cấu hình SMTP cho '{sectionName}' trong appsettings.json.");
            }

            await SendEmailWithCustomSettingsAsync(toEmail, subject, message, dynamicSettings);
        }
    }
}