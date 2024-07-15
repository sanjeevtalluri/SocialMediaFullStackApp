using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {

        public DateOnly DateOfBirth { get; set; }
        public required string KnownAs { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public DateTime LastActive { get; set; } = DateTime.UtcNow;
        public required string Gender { get; set; }
        public string? Introduction { get; set; }
        public string? LookingFor { get; set; }
        public string? Interests { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();
        public ICollection<UserLike> LikedByUsers { get; set; } = new List<UserLike>();
        public ICollection<UserLike> LikedUsers { get; set; } = new List<UserLike>();

        public ICollection<Message> MessagesSent { get; set; } = new List<Message>();

        public ICollection<Message> MessagesReceived { get; set; } = new List<Message>();

        public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();

        // public int GetAge()
        // {
        //     return DateOfBirth.CalculateAge();
        // }
    }
}