using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;

namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }

        public required string UserName { get; set; }
        public byte[] Password { get; set; } = new byte[0];
        public byte[] PasswordSalt { get; set; } = new byte[0];
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

        // public int GetAge()
        // {
        //     return DateOfBirth.CalculateAge();
        // }
    }
}