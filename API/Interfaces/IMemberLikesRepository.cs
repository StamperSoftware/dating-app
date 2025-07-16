using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberLikesRepository
{
    Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
    Task<PaginatedResult<Member>> GetMemberLikes(MemberLikeParams memberLikeParams);
    Task<IReadOnlyList<string>> GetMemberLikeIds(string memberId);
    void DeleteLike(MemberLike like);
    void AddLike(MemberLike like);
}