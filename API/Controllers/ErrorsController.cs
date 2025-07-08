using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ErrorsController:BaseController
{
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }
    [HttpGet("not-found")]
    
    public IActionResult GetNotFound()
    {
        return NotFound();
    }
    
    [HttpGet("server-error")]
    public IActionResult ServerError()
    {
        throw new Exception("Example of Server Error");
    }
    
    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("Example of Bad Request");
    }
}