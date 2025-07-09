using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository repo):BaseController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {
        var members = await repo.GetMembersAsync();
        return Ok(members);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember(string id)
    {
        var member = await repo.GetMemberAsync(id);
        
        if (member == null) return NotFound();
        
        return Ok(member);
    }

    [HttpGet("{memberId}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotosAsync(string memberId)
    {
        var photos = await repo.GetMemberPhotosAsync(memberId);
        return Ok(photos);
    }
}

