using System.Collections.Concurrent;
using api.Interfaces;
using api.Models;

namespace api.Service
{
    public class EmailQueueService : IEmailQueueService
    {
        private readonly ConcurrentQueue<EmailJob> _emailQueue = new();

        public void Enqueue(string toEmail, string subject, string body)
        {
            _emailQueue.Enqueue(new EmailJob
            {
                ToEmail = toEmail,
                Subject = subject,
                Body = body
            });
        }

        public void EnqueueWithEnrollmentCode(string enrollmentCode, string toEmail, string subject, string body)
        {
            _emailQueue.Enqueue(new EmailJob
            {
                EnrollmentCode = enrollmentCode,
                ToEmail = toEmail,
                Subject = subject,
                Body = body
            });
        }

        public bool TryDequeue(out EmailJob emailJob)
        {
            return _emailQueue.TryDequeue(out emailJob);
        }
    }
}