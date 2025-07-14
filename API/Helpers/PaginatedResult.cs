using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginatedResult<T>
{
    public PaginationMetadata Metadata { get; set; } = null!;
    public IList<T> Items { get; set; } = [];

}

public static class PaginationHelper
{
    public static async Task<PaginatedResult<T>> CreateAsync<T>(IQueryable<T> query, int pageIndex, int pageSize)
    {
        var count = await query.CountAsync();
        var items = await query.Skip(pageIndex * pageSize).Take(pageSize).ToListAsync();

        return new PaginatedResult<T>
        {
            Metadata = new PaginationMetadata
            {
                PageIndex = pageIndex,
                TotalCount = count,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize),
                PageSize = pageSize,
            },
            Items = items,
        };
    }
}

public class PaginationMetadata
{
    public int PageIndex { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
}
