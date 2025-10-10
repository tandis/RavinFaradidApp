using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp;

namespace RavinaFaradid.Forms.Domain.Entities
{
    public enum FormPermissionLevel
    {
        View = 0,
        Submit = 1,
        Edit = 2,
        Publish = 3,
        Delete = 4
    }

    public class FormPermission : FullAuditedAggregateRoot<Guid>
    {
        public Guid FormId { get; protected set; }

        // 🔹 کاربر خاص یا نقش خاص
        public Guid? UserId { get; protected set; }
        public Guid? RoleId { get; protected set; }

        // 🔹 نوع دسترسی
        public FormPermissionLevel PermissionLevel { get; protected set; }

        // Tenant
        public Guid? TenantId { get; set; }

        [ForeignKey(nameof(FormId))]
        public Form Form { get; protected set; }

        protected FormPermission() { }

        public FormPermission(Guid id, Guid formId, FormPermissionLevel level, Guid? userId = null, Guid? roleId = null)
            : base(id)
        {
            if (userId == null && roleId == null)
                throw new BusinessException("FormPermission.InvalidTarget")
                    .WithData("Message", "Permission must have either a UserId or RoleId.");

            FormId = formId;
            PermissionLevel = level;
            UserId = userId;
            RoleId = roleId;
        }
    }
}
