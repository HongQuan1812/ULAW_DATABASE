using api.Models;

namespace api.Interfaces
{
    public interface IEmailQueueService
    {
        void Enqueue(string toEmail, string subject, string body);
        void EnqueueWithEnrollmentCode(string enrollmentCode, string toEmail, string subject, string body);
        bool TryDequeue(out EmailJob emailJob);
    }
}