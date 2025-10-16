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
        None = 0,
        View = 1,
        Submit = 2,
        Edit = 3,
        Publish = 4,
        Delete = 5,
        Owner = 6
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

        protected FormPermission(object value, object id, Guid toFormId) { }

        public FormPermission(
                    Guid id,
                    Guid formId,
                    Guid? userId,
                    FormPermissionLevel permissionLevel,
                    Guid? roleId, Guid?
                    tenantId)
            : base(id)
        {
            if (userId == null && roleId == null)
                throw new BusinessException("FormPermission.InvalidTarget")
                    .WithData("Message", "Permission must have either a UserId or RoleId.");

            FormId = formId;
            PermissionLevel = permissionLevel;
            UserId = userId;
            RoleId = roleId;
        }

        public void SetPrincipal(Guid? userId, Guid? roleId)
        {
            UserId = userId;
            RoleId = roleId;
        }

        public void SetPermissionLevel(FormPermissionLevel level)
        {
            PermissionLevel = level;
        }

    }
}
