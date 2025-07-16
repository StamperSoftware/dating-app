namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRepository MemberRepository { get; }
    IMemberLikesRepository MemberLikesRepository { get; }
    IMessageRepository MessageRepository { get; }

    Task<bool> Complete();
    bool HasChanges();
}
