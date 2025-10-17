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
        None = 0, // هیچ دسترسی
        View = 1, // مشاهده فرم (Form صفحه و سوالات)
        Submit = 2, // ارسال پاسخ
        ManageOwn = 3  // مشاهده/ویرایش/حذف پاسخ‌های «خودِ کاربر»
         // در آینده اگر خواستم: Review, ManageAllResponses, ...
    }

    public class FormPermission : FullAuditedAggregateRoot<Guid>
    {
        public Guid FormId { get; protected set; }

        // 🔹 کاربر خاص یا نقش خاص
        public Guid? UserId { get; protected set; }
        public Guid? RoleId { get; protected set; }
        public bool IsAnonymous { get; protected set; } 
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
                    tenantId,
                    bool isAnonymous = false
            )
            : base(id)
        {
            if (userId == null && roleId == null)
                throw new BusinessException("FormPermission.InvalidTarget")
                    .WithData("Message", "Permission must have either a UserId or RoleId.");

            FormId = formId;
            PermissionLevel = permissionLevel;
            UserId = userId;
            RoleId = roleId;
            IsAnonymous = isAnonymous;
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
