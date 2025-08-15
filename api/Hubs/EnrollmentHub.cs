using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace api.Hubs
{
    [Authorize]
    public class EnrollmentHub : Hub
    {
        public async Task BroadcastEnrollmentChange()
        {
            await Clients.All.SendAsync("enrollmentDataChanged");
        }
        public async Task NotifyEnrollmentDetailDataChanged(string enrollmentCode)
        {
            await Clients.All.SendAsync("enrollmentDetailDataChanged", enrollmentCode);
        }
    }
}