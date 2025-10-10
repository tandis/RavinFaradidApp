using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class CreateVersionDto
    {
        [Required]
        public string JsonDefinition { get; set; }
        public string ThemeDefinition { get; set; }
    }
}
