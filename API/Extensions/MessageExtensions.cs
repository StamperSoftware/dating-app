﻿using System.Linq.Expressions;
using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class MessageExtensions
{
    public static MessageDto ToDto(this Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            SenderDisplayName = message.Sender.DisplayName,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientId = message.RecipientId,
            RecipientDisplayName = message.Recipient.DisplayName,
            RecipientImageUrl = message.Recipient.ImageUrl,
            MessageSent = message.MessageSent,
            DateRead = message.DateRead,
            Content = message.Content,
        };
    }
    
    public static Expression<Func<Message, MessageDto>> SelectDto() 
    {
        return message => new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            SenderDisplayName = message.Sender.DisplayName,
            SenderImageUrl = message.Sender.ImageUrl,
            RecipientId = message.RecipientId,
            RecipientDisplayName = message.Recipient.DisplayName,
            RecipientImageUrl = message.Recipient.ImageUrl,
            Content = message.Content,
            MessageSent = message.MessageSent,
            DateRead = message.DateRead,
        };
        
    }
}