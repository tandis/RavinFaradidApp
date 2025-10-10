using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace RavinaFaradid.Forms.Domain.Entities
{
    public class FormTemplate : FullAuditedAggregateRoot<Guid>, IMultiTenant
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string JsonDefinition { get; set; } // ساختار کامل فرم (SurveyJS JSON)
        public Guid? TenantId { get; set; }
    }

}
