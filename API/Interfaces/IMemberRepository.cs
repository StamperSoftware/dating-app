using API.Entities;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId);
    Task<Member?> GetMemberAsync(string id);
    Task<Member?> GetDetailedMemberAsync(string id);
}