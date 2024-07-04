using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class LoginDto
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }

    }
}