using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
[ServiceFilter<LogUserActivity>]
public class BaseController:ControllerBase
{
    
}