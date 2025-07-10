using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context):IMemberRepository
{
    public async void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
    

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await context.Members.ToListAsync();
    }

    public async Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId)
    {
        return await context.Members.Where(m => m.Id == memberId).SelectMany(m => m.Photos).ToListAsync();
    }

    public async Task<Member?> GetMemberAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }
    public async Task<Member?> GetDetailedMemberAsync(string id)
    {
        return await context.Members
            .Include(m => m.User)
            .SingleOrDefaultAsync(m => m.Id == id);
    }
}