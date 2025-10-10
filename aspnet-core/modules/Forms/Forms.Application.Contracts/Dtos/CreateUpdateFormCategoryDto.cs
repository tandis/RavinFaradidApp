using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class CreateUpdateFormCategoryDto
    {
        [Required]
        [StringLength(128)]
        public string Name { get; set; }

        [StringLength(512)]
        public string Description { get; set; }

        public Guid? ParentCategoryId { get; set; }
    }
}
