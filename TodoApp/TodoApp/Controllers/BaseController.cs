using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TodoApp.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected int UserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
