using RavinaFaradid.Forms.Domain.Entities;
using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Data;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{

    public class CreateFormResponseDto: FullAuditedEntityDto<Guid>, IHasExtraProperties
    {
        public ExtraPropertyDictionary ExtraProperties { get; set; } = new();
        public Guid FormId { get; set; }
        public Guid FormVersionId { get; set; }
        public string ResponseData { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
