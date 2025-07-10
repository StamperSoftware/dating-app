using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
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

    [HttpPut]
    public async Task<ActionResult> UpdateMember(UpdateMemberDto updateMemberDto)
    {

        var memberId = User.GetMemberId();
        
        var member = await repo.GetDetailedMemberAsync(memberId);
        if (member == null) return BadRequest("Could not find member");

        member.DisplayName = updateMemberDto.DisplayName ?? member.DisplayName;
        member.Description = updateMemberDto.Description ?? member.Description;
        member.City = updateMemberDto.City ?? member.City;
        member.Country = updateMemberDto.Country ?? member.Country;

        member.User.DisplayName = member.DisplayName;
        
        //repo.Update(member);

        if (await repo.SaveAllAsync()) return NoContent();
        
        return BadRequest("Failed to update member");
    }
    
    
}

