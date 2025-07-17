using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager, AppDbContext context, IPhotoService photoService):BaseController
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
    public async Task<ActionResult<IList<Photo>>> GetPhotosForModeration()
    {
        return Ok(await context.Photos.Where(p => !p.HasBeenApproved).ToListAsync());
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("approve-photo")]
    public async Task<ActionResult> ApproveMemberPhoto(int photoId)
    {
        var photo = await context.Photos.FindAsync(photoId);
        if (photo == null) return BadRequest("Could not find photo");
        photo.HasBeenApproved = true;
        await context.SaveChangesAsync();
        return Ok();
    }
    
    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("reject-photo")]
    public async Task<ActionResult> RejectMemberPhoto(int photoId)
    {
        var photo = await context.Photos.FindAsync(photoId);
        if (photo?.PublicId == null) return BadRequest("Could not find photo");
        
        await photoService.DeletePhotoAsync(photo.PublicId);
        context.Photos.Remove(photo);
        await context.SaveChangesAsync();
        return Ok();
    }
    
    
}