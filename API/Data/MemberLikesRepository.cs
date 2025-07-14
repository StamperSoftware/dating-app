using API.Data;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet.Core;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class MemberLikesRepository(AppDbContext context):IMemberLikesRepository
{
    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.MemberLikes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(MemberLikeParams memberLikeParams)
    {
        var query = context.MemberLikes.AsQueryable();
        IQueryable<Member> items; 
        
        switch (memberLikeParams.Predicate)
        {
            case "liked":
                items = query.Where(ml => ml.SourceMemberId == memberLikeParams.MemberId)
                    .Select(ml => ml.TargetMember);
                break;
            case "likedBy":
                items = query.Where(ml => ml.TargetMemberId == memberLikeParams.MemberId).Select(ml => ml.SourceMember);
                break;
            case "mutual":
                var likedIds = await GetMemberLikeIds(memberLikeParams.MemberId);

                items = query
                    .Where(ml => ml.TargetMemberId == memberLikeParams.MemberId && likedIds.Contains(ml.SourceMemberId))
                    .Select(ml => ml.SourceMember);
                break;
            default:
                throw new Exception("Not Supported");
        }

        return await PaginationHelper.CreateAsync(items, memberLikeParams.PageIndex, memberLikeParams.PageSize);
    }

    public async Task<IReadOnlyList<string>> GetMemberLikeIds(string memberId)
    {
        return await context.MemberLikes
            .Where(ml => ml.SourceMemberId == memberId)
            .Select(ml => ml.TargetMemberId)
            .ToListAsync();
    }

    public void DeleteLike(MemberLike like)
    {
        context.MemberLikes.Remove(like);
    }

    public void AddLike(MemberLike like)
    {
        context.MemberLikes.Add(like);
    }

    public async Task<bool> SaveAllChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}