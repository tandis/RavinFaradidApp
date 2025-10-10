using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class FormTemplateDto : AuditedEntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string JsonDefinition { get; set; }
    }
}
