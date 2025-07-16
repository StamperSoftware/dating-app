using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Group(string name)
{
    [Key] public string Name { get; set; } = name;

    public ICollection<Connection> Connections { get; set; } = [];
}