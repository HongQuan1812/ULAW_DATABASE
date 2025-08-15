using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace api.Hubs
{
    [Authorize]
    public class UserHub : Hub
    {
        public async Task NotifyUserDataChanged()
        {
            await Clients.All.SendAsync("userDataChanged");
        }
    }
}