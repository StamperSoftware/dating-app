using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UnitOfWork(AppDbContext context):IUnitOfWork
{
    private IMemberRepository? _memberRepository;
    private IMemberLikesRepository? _memberLikesRepository;
    private IMessageRepository? _messageRepository;

    public IMemberRepository MemberRepository => _memberRepository ??= new MemberRepository(context);
    public IMemberLikesRepository MemberLikesRepository => _memberLikesRepository ??= new MemberLikesRepository(context);
    public IMessageRepository MessageRepository => _messageRepository ??= new MessageRepository(context);

    public async Task<bool> Complete()
    {
        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("Error occurred while saving changes", ex);
        }
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}