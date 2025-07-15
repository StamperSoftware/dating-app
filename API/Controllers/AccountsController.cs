using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountsController(UserManager<AppUser> userManager, ITokenService tokenService):BaseController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        
        AppUser user = new()
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Email,
            Member = new Member
            {
                City = registerDto.City,
                Country = registerDto.Country,
                DateOfBirth = registerDto.DateOfBirth,
                DisplayName = registerDto.DisplayName,
                Gender = registerDto.Gender,
            }
            
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            foreach (var err in result.Errors)
            {
                ModelState.AddModelError("identity", err.Description);
            }

            return ValidationProblem();
        }

        result = await userManager.AddToRoleAsync(user, "Member");
        if (!result.Succeeded)
        {
            foreach (var err in result.Errors)
            {
                ModelState.AddModelError("role", err.Description);
            }

            return ValidationProblem();
        }

        await SetRefreshTokenCookie(user);
        
        return Ok(await user.ToDto(tokenService));
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null) return Unauthorized("Could not validate user");
        var result = await userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!result) return Unauthorized("Could not validate user");
        
        await SetRefreshTokenCookie(user);
        
        return Ok(await user.ToDto(tokenService));
    }


    [HttpPost("refresh-token")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (refreshToken == null) return NoContent();
        var user = await userManager.Users.FirstOrDefaultAsync(u =>
            u.RefreshToken == refreshToken && u.RefreshTokenExpirationDate > DateTime.UtcNow);

        if (user == null) return Unauthorized();
        await SetRefreshTokenCookie(user);
        return await user.ToDto(tokenService);
        
    }
    
    [HttpPost("logout")]
    public void Logout()
    {
    }

    private async Task SetRefreshTokenCookie(AppUser user)
    {
        var refreshToken = tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpirationDate = DateTime.UtcNow.AddDays(7);
        await userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7),
        };
        
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    } 

}
