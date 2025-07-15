using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager):BaseController
{

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<IActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users.ToListAsync();

        var userList = new List<object>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            userList.Add(new
            {
                user.Id,
                user.Email,
                Roles = roles.ToList(),
            });
        }
        
        return Ok(userList);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("roles/{userId}")]
    public async Task<ActionResult<IList<string>>> AddUserToRole(string userId, [FromQuery]string roles)
    {
        if (string.IsNullOrWhiteSpace(roles)) return BadRequest("Roles cannot be empty");
        var selectedRoles = roles.Split(",");
        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return BadRequest("Could not find user");

        var userRoles = await userManager.GetRolesAsync(user);
        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded) return BadRequest("Could not add user to roles");
        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!result.Succeeded) return BadRequest("Could not remove user from roles");
        return Ok(await userManager.GetRolesAsync(user));
    }
    
    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public IActionResult GetPhotosForModeration()
    {
        return Ok();
    }
    
    
}