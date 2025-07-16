using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MemberLikesController(IUnitOfWork uow):BaseController
{

    
    [HttpPost ("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();
        if (sourceMemberId == targetMemberId) return BadRequest("Can not like yourself... pathetic");
        
        var existingLike = await uow.MemberLikesRepository.GetMemberLike(sourceMemberId, targetMemberId);

        if (existingLike == null)
        {
            existingLike = new MemberLike()
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId,
            };
            uow.MemberLikesRepository.AddLike(existingLike);
        }
        else
        {
            uow.MemberLikesRepository.DeleteLike(existingLike);
        }

        if (await uow.Complete()) return Ok();

        return BadRequest("Had issues with member like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetMemberLikeIds()
    {
        return Ok(await uow.MemberLikesRepository.GetMemberLikeIds(User.GetMemberId()));
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes([FromQuery]MemberLikeParams memberLikeParams)
    {
        memberLikeParams.MemberId = User.GetMemberId();
        var members = await uow.MemberLikesRepository.GetMemberLikes(memberLikeParams);
        return Ok(members);
    }
}

