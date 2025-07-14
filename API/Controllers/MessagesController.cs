using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IMessageRepository repo, IMemberRepository memberRepo):BaseController
{

    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
    {

        var sender = await memberRepo.GetMemberAsync(User.GetMemberId());
        var recipient = await memberRepo.GetMemberAsync(messageDto.RecipientId);

        if (sender is null || recipient is null || sender.Id == recipient.Id) return BadRequest("Can not send message.");
        
        var message =  new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = messageDto.Content,
        };
        
        repo.AddMessage(message);
        
        if (await repo.SaveAllAsync()) return Ok(message.ToDto());
        return BadRequest("Error sending message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMemberMessages([FromQuery] MessageParams messageParams)
    {
        messageParams.MemberId = User.GetMemberId();
        return await repo.GetMemberMessages(messageParams);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessageThread(string recipientId)
    {
        return Ok(await repo.GetMessageThread(User.GetMemberId(), recipientId));
    }
    
}

