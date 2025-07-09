using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;
        var membersJson = await File.ReadAllTextAsync("Data/SeedData/Users.json");
        var members = JsonSerializer.Deserialize<IList<SeedUserDto>>(membersJson);

        if (members == null)
        {
            Console.WriteLine("no seed members");
            return;
        }

        foreach (var member in members)
        {
            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    Gender = member.Gender,
                    ImageUrl = member.ImageUrl,
                    City = member.City,
                    Country = member.Country,
                    Created = member.Created,
                    LastActive = member.LastActive,
                }
            };

            user.Member.Photos.Add(new Photo
            {
                Url=member.ImageUrl!,
                MemberId = member.Id,
            });

            context.Users.Add(user);

        }

        await context.SaveChangesAsync();
    }
}