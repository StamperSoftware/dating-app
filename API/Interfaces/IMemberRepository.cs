using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);
    Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId);
    Task<Member?> GetMemberAsync(string id);
    Task<Member?> GetDetailedMemberAsync(string id);
}