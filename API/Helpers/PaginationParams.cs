namespace API.Helpers;

public class PaginationParams
{
    private const int MAX_PAGE_SIZE = 50;
    public int PageIndex { get; set; }
    private int _pageSize = 10;
    public int PageSize { get => _pageSize; set => _pageSize = value > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : value;} 
}
