using System.Collections.Generic;
using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.Guids;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace RavinaFaradid.Forms.Domain.Entities
{
    /// <summary>
    /// فرم اصلی (Aggregate Root)
    /// </summary>
    public class Form : FullAuditedAggregateRoot<Guid>
    {
        public string Title { get; protected set; }
        public string Description { get; protected set; }
        public bool IsActive { get; protected set; }

        public void SetMeta(string title, string description, Guid? categoryId)
        {
            Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 128).Trim();
            Description = description?.Trim();
            CategoryId = categoryId;
        }
        public Guid? TenantId { get; set; }

        // ارتباط با دسته‌بندی
        public Guid? CategoryId { get; protected set; }

        [ForeignKey(nameof(CategoryId))]
        public FormCategory Category { get; protected set; }

        // آخرین نسخه منتشرشده
        public Guid? PublishedVersionId { get; protected set; }
        /// <summary>
        /// آیا این فرم برای کاربران ناشناس قابل دسترسی است؟
        /// </summary>
        public bool IsAnonymousAllowed { get; set; } = false;
        public ICollection<FormVersion> Versions { get; protected set; }
        public ICollection<FormResponse> Responses { get; protected set; }

        protected Form() { }

        public Form(Guid id, string title, string description = null, Guid? categoryId = null,
           bool isActive = true, bool isAnonymousAllowed = false)
           : base(id)
        {
            Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 256);
            Description = description;
            CategoryId = categoryId;
            IsActive = isActive;
            IsAnonymousAllowed = isAnonymousAllowed;

            Versions = new List<FormVersion>();
            Responses = new List<FormResponse>();
            Permissions = new List<FormPermission>();
        }

        public FormVersion CreateInitialVersion(string jsonDefinition, string themeDefinition = null)
        {
            var version = new FormVersion(Guid.NewGuid(), this.Id, jsonDefinition, themeDefinition, baseVersionNumber: null);
            Versions.Add(version);
            return version;
        }

        public void SetPublishedVersion(Guid versionId)
        {
            PublishedVersionId = versionId;
            IsActive = true;
        }

        public void SetCategory(Guid? categoryId)
        {
            CategoryId = categoryId;
        }

        public ICollection<FormPermission> Permissions { get; protected set; }



        public void Deactivate() => IsActive = false;
        public void Activate() => IsActive = true;

        public void PublishVersion(Guid versionId ,string title, string description)
        {
            var version = Versions.FirstOrDefault(v => v.Id == versionId)
                ?? throw new BusinessException("FormVersion.NotFound");

            // فقط یک نسخه می‌تواند فعال باشد
            foreach (var v in Versions.Where(x => x.Status == FormVersionStatus.Published))
                v.Unpublish();

            version.Publish();
            PublishedVersionId = version.Id;
            IsActive = true;
            Title = title;
            Description = description;
        }

        public void UnpublishCurrentVersion()
        {
            if (!PublishedVersionId.HasValue)
                throw new BusinessException("Form.NoPublishedVersion");

            var version = Versions.First(x => x.Id == PublishedVersionId.Value);
            version.Unpublish();
            PublishedVersionId = null;
        }

        public void ArchiveVersion(Guid versionId)
        {
            var version = Versions.FirstOrDefault(v => v.Id == versionId)
                ?? throw new BusinessException("FormVersion.NotFound");

            version.Archive();
        }

        public FormVersion CreateNextVersion(string jsonDefinition, string themeDefinition = null)
        {
            if (Versions == null)
                Versions = new List<FormVersion>();

            // آخرین نسخه موجود را پیدا کن
            var lastVersion = Versions
                .OrderByDescending(v => v.VersionNumber)
                .FirstOrDefault();

            var nextVersionNumber = (lastVersion?.VersionNumber ?? 0) + 1;

            var newVersion = new FormVersion(
                Guid.NewGuid(),
                this.Id,
                jsonDefinition,
                themeDefinition,
                FormVersionStatus.Draft,
                nextVersionNumber
            );

            Versions.Add(newVersion);
            return newVersion;
        }

        public FormVersion CreateNewVersion(string jsonDefinition, string themeDefinition = null)
        {
            if (Versions == null)
                Versions = new List<FormVersion>();

            // اگر نسخه‌ای قبلاً وجود نداشته باشد، نسخه 0 را بساز
            if (!Versions.Any())
            {
                var initial = new FormVersion(Guid.NewGuid(), this.Id, jsonDefinition, themeDefinition, 0);
                Versions.Add(initial);
                return initial;
            }

            // آخرین نسخه را پیدا کن
            var lastVersion = Versions.OrderByDescending(v => v.VersionNumber).FirstOrDefault();
            var nextVersionNumber = (lastVersion?.VersionNumber ?? 0) + 1;

            // نسخه جدید را ایجاد کن
            var version = new FormVersion(Guid.NewGuid(), this.Id, jsonDefinition, themeDefinition, FormVersionStatus.Draft, nextVersionNumber);

            Versions.Add(version);
            return version;
        }



    }
}