using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class MessageHub(IUnitOfWork uow, IHubContext<PresenceHub> presenceHub): Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUserId = httpContext?.Request.Query["userId"].ToString() ?? throw new Exception("Could not find user");

        var groupName = GetGroupName(Context.User?.GetMemberId(), otherUserId);

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        await AddToGroup(groupName);
        
        var messages = await uow.MessageRepository.GetMessageThread(GetUserId(), otherUserId);
        await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await uow.MessageRepository.RemoveConnection(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(CreateMessageDto messageDto)
    {
        
        var sender = await uow.MemberRepository.GetMemberAsync(GetUserId());
        var recipient = await uow.MemberRepository.GetMemberAsync(messageDto.RecipientId);

        if (sender is null || recipient is null || sender.Id == recipient.Id) throw new HubException("Can not send message.");
        
        var message =  new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = messageDto.Content,
        };

        var groupName = GetGroupName(sender.Id, recipient.Id );

        var group = await uow.MessageRepository.GetMessageGroup(groupName);
        var isUserInGroup = group != null && group.Connections.Any(c => c.UserId == message.RecipientId);
        
        if (isUserInGroup) message.DateRead = DateTime.UtcNow;
        
        uow.MessageRepository.AddMessage(message);

        if (await uow.Complete())
        {
            await Clients.Group(groupName).SendAsync("NewMessage", message.ToDto());

            var connections = await PresenceTracker.GetConnectionsForUser(recipient.Id);
            
            if (connections?.Count > 0 && !isUserInGroup)
            {
                await presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived", message.ToDto());
            }

        }
    }
    
    private static string GetGroupName(string? callerId, string? otherUserId)
    {
        var stringCompare = string.CompareOrdinal(callerId, otherUserId) < 0;
        return stringCompare ? $"{callerId}-{otherUserId}" : $"{otherUserId}-{callerId}";
    }

    private string GetUserId()
    {
        return Context.User?.GetMemberId() ?? throw new HubException("Could not get user");
    }

    private async Task<bool> AddToGroup(string groupName)
    {
        var group = await uow.MessageRepository.GetMessageGroup(groupName);
        var connection = new Connection(Context.ConnectionId, GetUserId());

        if (group == null)
        {
            group = new Group(groupName);
            uow.MessageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        return await uow.Complete();
    }
    
}