using API.Entities;
using API.Helpers;
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
    

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable();
        
        query = query.Where(m => m.Id != memberParams.CurrentMemberId);

        if (!string.IsNullOrWhiteSpace(memberParams.Gender))
            query = query.Where(m => m.Gender.Equals(memberParams.Gender));

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(m => m.DateOfBirth >= minDob && m.DateOfBirth <= maxDob);

        if (!string.IsNullOrWhiteSpace(memberParams.Name))
            query = query.Where(m => m.DisplayName.ToLower().Contains(memberParams.Name.ToLower()));

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            "lastActive" => query.OrderByDescending(x => x.LastActive),
            _ => query.OrderBy(x => x.DisplayName),
        };
        
        
        return await PaginationHelper.CreateAsync(query, memberParams.PageIndex, memberParams.pageSize);
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
            .Include(m => m.Photos)
            .SingleOrDefaultAsync(m => m.Id == id);
    }
}