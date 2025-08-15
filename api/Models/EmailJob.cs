namespace api.Models
{
    public class EmailJob
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string EnrollmentCode { get; set; }
    }
}