using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context):IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDto>> GetMemberMessages(MessageParams messageParams)
    {
        var query = context.Messages.OrderByDescending(m => m.MessageSent).AsQueryable();

        query = messageParams.Container switch
        {
            "outbox" => query.Where(m => m.SenderId == messageParams.MemberId && !m.HasSenderDeleted),
            "inbox" => query.Where(m => m.RecipientId == messageParams.MemberId && !m.HasRecipientDeleted),
            _ => throw new Exception("not supported"),
        };

        var messageQuery = query.Select(MessageExtensions.SelectDto());
        return await PaginationHelper.CreateAsync(messageQuery, messageParams.PageIndex, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await context.Messages
            .Where(m => m.RecipientId == currentMemberId)
            .Where(m => m.SenderId == recipientId)
            .Where(m => m.DateRead == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.DateRead, DateTime.UtcNow));

        return await context.Messages
            .Where(m => (m.RecipientId == currentMemberId && m.SenderId == recipientId && !m.HasRecipientDeleted) || (m.SenderId == currentMemberId && m.RecipientId == recipientId && !m.HasSenderDeleted))
            .OrderBy(m => m.MessageSent)
            .Select(MessageExtensions.SelectDto())
            .ToListAsync();

    }

    public void AddGroup(Group group)
    {
        context.Groups.Add(group);
    }

    public async Task RemoveConnection(string connectionId)
    {
        await context.Connections.Where(c => c.ConnectionId == connectionId).ExecuteDeleteAsync();
    }

    public async Task<Connection?> GetConnection(string connectionId)
    {
        return await context.Connections.FindAsync(connectionId);
    }

    public async Task<Group?> GetMessageGroup(string groupName)
    {
        return await context.Groups.Include(g => g.Connections).FirstOrDefaultAsync(g => g.Name == groupName);
    }

    public async Task<Group?> GetGroupForConnection(string connectionId)
    {
        return await context.Groups.Include(g => g.Connections)
            .Where(g => g.Connections.Any(c => c.ConnectionId == connectionId)).FirstOrDefaultAsync();
    }
    
    
}

