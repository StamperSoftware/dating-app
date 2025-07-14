namespace API.Helpers;

public class MemberLikeParams:PaginationParams
{
    public string MemberId { get; set; } = "";
    public string Predicate { get; set; } = "liked";
}