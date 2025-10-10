using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using RavinaFaradid.Forms;
using System.ComponentModel.DataAnnotations.Schema;
using Volo.Abp;
namespace RavinaFaradid.Forms.Domain.Entities
{
    /// <summary>
    /// پاسخ‌های فرم (وابسته به نسخه خاص)
    /// </summary>
    public class FormResponse : FullAuditedAggregateRoot<Guid>
    {
        public Guid FormId { get; protected set; }
        public Guid FormVersionId { get; protected set; }
        public Guid? TenantId { get; set; }

        // JSON پاسخ کاربر
        public string ResponseData { get; protected set; }

        public DateTime SubmittedAt { get; protected set; }

        [ForeignKey(nameof(FormId))]
        public Form Form { get; protected set; }

        [ForeignKey(nameof(FormVersionId))]
        public FormVersion Version { get; protected set; }

        protected FormResponse() { }

        public FormResponse(Guid id, Guid formId, Guid formVersionId, string responseData)
            : base(id)
        {
            FormId = formId;
            FormVersionId = formVersionId;
            ResponseData = Check.NotNullOrWhiteSpace(responseData, nameof(responseData));
            SubmittedAt = DateTime.UtcNow;
        }
    }
}
