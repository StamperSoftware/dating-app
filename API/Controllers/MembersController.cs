using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository repo, IPhotoService photoService)
    : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers([FromQuery]MemberParams memberParams)
    {
        memberParams.CurrentMemberId = User.GetMemberId();
        var members = await repo.GetMembersAsync(memberParams);
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

    [HttpPost("{memberId}/photos")]
    public async Task<ActionResult<Photo>> UploadPhoto(string memberId, [FromForm]IFormFile file)
    {
        var member = await repo.GetDetailedMemberAsync(memberId);
        if (member == null) return BadRequest("Member not found");

        var result = await photoService.UploadPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);



        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            MemberId = member.Id,
        };

        if (member.ImageUrl == null)
        {
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
        }

        member.Photos.Add(photo);
        
        if (await repo.SaveAllAsync()) return Ok(photo);
        return BadRequest("Could not save photo");
    }


    [HttpPut("{memberId}/photos/main/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(string memberId, int photoId)
    {
        var member = await repo.GetDetailedMemberAsync(memberId);
        if (member == null) return BadRequest("Could not find member");

        var photo = member.Photos.SingleOrDefault(p => p.Id == photoId);
        if (photo == null) return BadRequest("Could not find photo");
        if (member.ImageUrl == photo.Url) return Ok();
        member.ImageUrl = photo.Url;
        member.User.ImageUrl = photo.Url;

        if (await repo.SaveAllAsync()) return NoContent();
        return BadRequest("Error");
    }

    [HttpDelete("{memberId}/photos/{photoId}")]
    public async Task<ActionResult> DeletePhoto(string memberId, int photoId)
    {
        var member = await repo.GetDetailedMemberAsync(memberId);
        if (member == null) return BadRequest("Could not find member");

        var photo = member.Photos.SingleOrDefault(p => p.Id == photoId);
        if (photo == null) return BadRequest("Could not find photo");

        if (member.ImageUrl == photo.Url) return BadRequest("Can not delete main photo");
        
        if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);
        }

        member.Photos.Remove(photo);
        if (await repo.SaveAllAsync()) return Ok();
        
        return BadRequest("Could not delete photo");
    }
    
    
}

