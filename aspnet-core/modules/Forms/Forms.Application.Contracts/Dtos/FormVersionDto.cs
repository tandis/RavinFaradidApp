using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class FormVersionDto : FullAuditedEntityDto<Guid>
    {
        public int VersionNumber { get; set; }
        public string JsonDefinition { get; set; }
        public string ThemeDefinition { get; set; }
        public string DefinitionHash { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
}
