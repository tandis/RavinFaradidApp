using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class FormResponseDto : FullAuditedEntityDto<Guid>
    {
        public Guid FormId { get; set; }
        public Guid FormVersionId { get; set; }
        public string ResponseData { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
