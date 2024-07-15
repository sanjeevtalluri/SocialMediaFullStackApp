using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class CreateMessageDto
    {
        public required string RecipientUsername { get; set; }
        public required string Content { get; set; }
    }
}