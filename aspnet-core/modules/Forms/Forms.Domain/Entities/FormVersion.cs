using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp;
using RavinaFaradid.Forms;

namespace RavinaFaradid.Forms.Domain.Entities
{
    public enum FormVersionStatus
    {
        Draft = 0,
        Published = 1,
        Archived = 2
    }
    public class FormVersion : FullAuditedAggregateRoot<Guid>
    {
        public Guid FormId { get; protected set; }

        // شماره نسخه (مثلاً 1, 2, 3)
        public int VersionNumber { get; protected set; }

        // JSON اصلی SurveyJS
        public string JsonDefinition { get; protected set; }

        // JSON تم فرم
        public string ThemeDefinition { get; protected set; }

        // هش برای کش و شناسایی تغییر
        public string DefinitionHash { get; protected set; }

        public DateTime? PublishedAt { get; protected set; }

        public FormVersionStatus Status { get; protected set; }

        [ForeignKey(nameof(FormId))]
        public Form Form { get; protected set; }

        protected FormVersion() { }

        public FormVersion(Guid id, Guid formId, string jsonDefinition, string themeDefinition = null, FormVersionStatus status = FormVersionStatus.Draft, int? baseVersionNumber = null)
            : base(id)
        {
            FormId = formId;
            JsonDefinition = Check.NotNullOrWhiteSpace(jsonDefinition, nameof(jsonDefinition));
            ThemeDefinition = themeDefinition;
            VersionNumber = (baseVersionNumber ?? 0);
            DefinitionHash = ComputeHash(jsonDefinition);
            Status = status;//FormVersionStatus.Draft; // پیش‌فرض: پیش‌نویس
        }

        /// <summary>
        /// فقط برای Draft اجازهٔ تغییر می‌دهیم.
        /// </summary>
        public void SetDraftContent(string jsonDefinition, string themeDefinition, FormVersionStatus status)
        {
            EnsureDraft();
            SetDraftContentInternal(jsonDefinition, themeDefinition);
            Status = status;
            // اگر از کانکارنسی استفاده می‌کنی می‌تونی استمپ جدید بزنی:
            // ConcurrencyStamp = Guid.NewGuid().ToString("N");
        }

        private void SetDraftContentInternal(string jsonDefinition, string themeDefinition)
        {
            JsonDefinition = Check.NotNullOrWhiteSpace(jsonDefinition, nameof(jsonDefinition));
            ThemeDefinition = string.IsNullOrWhiteSpace(themeDefinition) ? "{}" : themeDefinition;
        }

        private void EnsureDraft()
        {
            if (Status != FormVersionStatus.Draft)
                throw new BusinessException("Forms:CannotModifyNonDraftVersion");
        }

        public void Publish()
        {
            if (Status == FormVersionStatus.Published)
                throw new BusinessException("FormVersion.AlreadyPublished")
                    .WithData("Version", VersionNumber);

            Status = FormVersionStatus.Published;
            PublishedAt = DateTime.UtcNow;
        }

        public void Unpublish()
        {
            if (Status != FormVersionStatus.Published)
                throw new BusinessException("FormVersion.NotPublished");
            Status = FormVersionStatus.Draft;
            PublishedAt = null;
        }

        public void Archive()
        {
            Status = FormVersionStatus.Archived;
        }

        private static string ComputeHash(string json)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = System.Text.Encoding.UTF8.GetBytes(json ?? "");
            return Convert.ToHexString(sha.ComputeHash(bytes));
        }

        public void PromoteToPublished(int newVersionNumber)
        {
            EnsureDraft();
            Status = FormVersionStatus.Published;
            VersionNumber = newVersionNumber;
            PublishedAt = DateTime.UtcNow;
            // ConcurrencyStamp = Guid.NewGuid().ToString("N");
        }
    }
}
