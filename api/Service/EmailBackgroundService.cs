using Microsoft.Extensions.Hosting;
using api.Interfaces;
using api.Models;

namespace api.Service
{
    public class EmailBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IEmailQueueService _queueService;

        public EmailBackgroundService(IServiceProvider serviceProvider, IEmailQueueService queueService)
        {
            _serviceProvider = serviceProvider;
            _queueService = queueService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_queueService.TryDequeue(out var job))
                {
                    using var scope = _serviceProvider.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    try
                    {
                        if (!string.IsNullOrWhiteSpace(job.EnrollmentCode))
                        {
                            await emailService.SendEmailByEnrollmentCodeAsync(
                                job.EnrollmentCode,
                                job.ToEmail,
                                job.Subject,
                                job.Body
                            );
                        }
                        else
                        {
                            await emailService.SendEmailAsync(job.ToEmail, job.Subject, job.Body);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Gửi Email thất bại: {ex.Message}");
                    }
                }

                await Task.Delay(500, stoppingToken);
            }
        }
    }
}