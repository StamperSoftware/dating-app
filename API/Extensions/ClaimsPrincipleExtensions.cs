using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetMemberId(this ClaimsPrincipal user) => 
        user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Could not get id");
}