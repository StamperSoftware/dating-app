using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MemberLikesController(IMemberLikesRepository repo):BaseController
{

    [HttpPost ("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();
        if (sourceMemberId == targetMemberId) return BadRequest("Can not like yourself... pathetic");
        
        var existingLike = await repo.GetMemberLike(sourceMemberId, targetMemberId);

        if (existingLike == null)
        {
            existingLike = new MemberLike()
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId,
            };
            repo.AddLike(existingLike);
        }
        else
        {
            repo.DeleteLike(existingLike);
        }

        if (await repo.SaveAllChangesAsync()) return Ok();

        return BadRequest("Had issues with member like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetMemberLikeIds()
    {
        return Ok(await repo.GetMemberLikeIds(User.GetMemberId()));
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes([FromQuery]MemberLikeParams memberLikeParams)
    {
        memberLikeParams.MemberId = User.GetMemberId();
        var members = await repo.GetMemberLikes(memberLikeParams);
        return Ok(members);
    }
}

