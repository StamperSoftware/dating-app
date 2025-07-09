using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Member
{
    public string Id { get; set; } = null!;
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateOnly DateOfBirth { get; set; }
    public string? Description { get; set; }
    public required string DisplayName { get; set; }
    public required string Gender { get; set; }
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public string? ImageUrl { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }

    [ForeignKey(nameof(Id))]
    [JsonIgnore]
    public AppUser User { get; set; } = null!;

    [JsonIgnore]
    public IList<Photo> Photos { get; set; } = [];

}
    
