using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IUnitOfWork uow):BaseController
{

    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
    {

        var sender = await uow.MemberRepository.GetMemberAsync(User.GetMemberId());
        var recipient = await uow.MemberRepository.GetMemberAsync(messageDto.RecipientId);

        if (sender is null || recipient is null || sender.Id == recipient.Id) return BadRequest("Can not send message.");
        
        var message =  new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = messageDto.Content,
        };
        
        uow.MessageRepository.AddMessage(message);
        
        if (await uow.Complete()) return Ok(message.ToDto());
        return BadRequest("Error sending message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMemberMessages([FromQuery] MessageParams messageParams)
    {
        messageParams.MemberId = User.GetMemberId();
        return await uow.MessageRepository.GetMemberMessages(messageParams);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessageThread(string recipientId)   
    {
        return Ok(await uow.MessageRepository.GetMessageThread(User.GetMemberId(), recipientId));
    }


    [HttpDelete("{messageId}")]
    public async Task<ActionResult> DeleteMessage(string messageId)
    {
        var memberId = User.GetMemberId();
        var message = await uow.MessageRepository.GetMessage(messageId);
        
        if (message == null) return BadRequest("Could not get message");
        if (memberId != message.SenderId && memberId != message.RecipientId) return BadRequest("Could not delete message");
        
        if (memberId == message.SenderId) message.HasSenderDeleted = true;
        if (memberId == message.RecipientId) message.HasRecipientDeleted = true;

        if (message is { HasSenderDeleted: true, HasRecipientDeleted: true })
        {
            uow.MessageRepository.DeleteMessage(message);
        }
        
        if (await uow.Complete()) return Ok();
        return BadRequest("Could not delete message");
    }
    
}

