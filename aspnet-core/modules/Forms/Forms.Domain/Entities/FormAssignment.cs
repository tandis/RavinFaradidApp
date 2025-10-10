using RavinaFaradid.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace RavinaFaradid.Forms.Domain.Entities
{
    public class FormAssignment : FullAuditedAggregateRoot<Guid>, IMultiTenant
    {
        public Guid FormId { get; set; }
        public Guid? TargetUserId { get; set; }
        public Guid? TargetRoleId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid? TenantId { get; set; }


        public Form Form { get; set; }
    }
}
