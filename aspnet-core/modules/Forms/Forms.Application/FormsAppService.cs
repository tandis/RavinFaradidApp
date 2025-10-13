using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Domain.Entities;
using System.Linq;
using Volo.Abp.Users;
using System.Text.Json;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Authorization;
using Microsoft.AspNetCore.Authorization;
using RavinaFaradid.Forms.Permissions;

namespace RavinaFaradid.Forms.Application
{
    public class FormAppService :
        CrudAppService<
            Form,
            FormDto,
            Guid,
            PagedAndSortedResultRequestDto,
            CreateUpdateFormDto>,
        IFormAppService
    {
        private readonly IRepository<Form, Guid> _formRepo;
        private readonly IRepository<FormVersion, Guid> _versionRepo;
        private readonly ICurrentUser _currentUser;
        public FormAppService(IRepository<Form, Guid> formRepo,
            IRepository<FormVersion, Guid> versionRepo,
        ICurrentUser currentUser
            ):base(formRepo)
            
        {
            _formRepo = formRepo;
            _versionRepo = versionRepo;
            _currentUser = currentUser;
        }


        [Authorize(RavinaFaradidFormsPermissions.Forms.Default)]
        public override Task<PagedResultDto<FormDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        => base.GetListAsync(input);


        [Authorize(RavinaFaradidFormsPermissions.Forms.Default)]
        public override Task<FormDto> GetAsync(Guid id)
        => base.GetAsync(id);

        //[HttpPost]
        //[Authorize(RavinFaradidFormsPermissions.Forms.Create)]
        //public override async Task<FormDto> CreateAsync([FromBody] CreateUpdateFormDto input)
        //{
        //    Check.NotNull(input, nameof(input));

        //    var form = new Form(
        //        Guid.NewGuid(),
        //        input.Title,
        //        input.Description,
        //        input.CategoryId,
        //        input.IsActive,
        //        input.IsAnonymousAllowed
        //    );

        //    // نسخه اولیه (Version 0) + انتشار اختیاری
        //    var version = form.CreateInitialVersion(input.JsonDefinition, input.ThemeDefinition);
        //    form.PublishVersion(version.Id);

        //    await Repository.InsertAsync(form, autoSave: true);
        //    return ObjectMapper.Map<Form, FormDto>(form);
        //}

        //[HttpPut("{id:guid}")]
        //[Authorize(RavinFaradidFormsPermissions.Forms.Update)]
        //public override Task<FormDto> UpdateAsync(Guid id, [FromBody] CreateUpdateFormDto input)
        //=> base.UpdateAsync(id, input);

        //[HttpDelete("{id:guid}")]
        [Authorize(RavinaFaradidFormsPermissions.Forms.Delete)]
        public override Task DeleteAsync(Guid id)
            => base.DeleteAsync(id);


        [Authorize(RavinaFaradidFormsPermissions.Forms.Publish)]
        public virtual async Task<FormVersionDto> GetPublishedVersionAsync(Guid id)
        {
            var form = await _formRepo.GetAsync(id);
            if (form.PublishedVersionId == null)
                throw new UserFriendlyException("No published version.");

            var ver = await _versionRepo.GetAsync(form.PublishedVersionId.Value);

            // (اختیاری) فقط نسخه‌های Published را مجاز کن
            if (!string.Equals(ver.Status.ToString(), "Published", StringComparison.OrdinalIgnoreCase) && ver.PublishedAt == null)
                throw new BusinessException("FormVersionNotPublished");

            return ObjectMapper.Map<FormVersion, FormVersionDto>(ver);
        }

        [AllowAnonymous]
        public virtual async Task<FormViewerDto> GetViewerAsync(Guid id)
        {
            var form = await _formRepo.GetAsync(id);
            if (form == null)
                throw new EntityNotFoundException(typeof(Form), id);

            if (!form.IsActive)
                throw new BusinessException("FormNotActive");

            if (!form.IsAnonymousAllowed && !_currentUser.IsAuthenticated)
                throw new AbpAuthorizationException("Login required");

            if (form.PublishedVersionId == null)
                return new FormViewerDto
                {
                    FormId = form.Id,
                    Title = form.Title,
                    Description = form.Description,
                    IsActive = form.IsActive,
                    IsAnonymousAllowed = form.IsAnonymousAllowed,
                    PublishedVersion = null
                };

            var ver = await _versionRepo.GetAsync(form.PublishedVersionId.Value);

            // امنیت: فقط نسخه Published را نشان بده
            if (!string.Equals(ver.Status.ToString(), "Published", StringComparison.OrdinalIgnoreCase) && ver.PublishedAt == null)
                throw new BusinessException("FormVersionNotPublished");

            object? schemaObj = null;
            object? themeObj = null;
            try { schemaObj = string.IsNullOrWhiteSpace(ver.JsonDefinition) ? null : JsonSerializer.Deserialize<object>(ver.JsonDefinition); } catch { }
            try { themeObj = string.IsNullOrWhiteSpace(ver.ThemeDefinition) ? null : JsonSerializer.Deserialize<object>(ver.ThemeDefinition); } catch { }

            return new FormViewerDto
            {
                FormId = form.Id,
                Title = form.Title,
                Description = form.Description,
                IsActive = form.IsActive,
                IsAnonymousAllowed = form.IsAnonymousAllowed,
                PublishedVersion = new FormViewerVersionDto
                {
                    Id = ver.Id,
                    VersionNumber = ver.VersionNumber,
                    PublishedAt = ver.PublishedAt,
                    SchemaJson = schemaObj ?? new object(),
                    ThemeJson = themeObj
                }
            };
        }
        [Authorize(RavinaFaradidFormsPermissions.Forms.Create)]
        // ✅ ایجاد فرم جدید همراه با نسخه اولیه (Version 0)
        public override async Task<FormDto> CreateAsync(CreateUpdateFormDto input)
        {
            Check.NotNull(input, nameof(input));

            var form = new Form(
                Guid.NewGuid(),
                input.Title,
                input.Description,
                input.CategoryId,
                input.IsActive,
                input.IsAnonymousAllowed
            );

            // نسخه اولیه (version 0)
            var version = form.CreateInitialVersion(input.JsonDefinition, input.ThemeDefinition);

            // اگر بخواهیم به‌صورت خودکار نسخه 0 منتشر شود:
            //form.PublishVersion(version.Id);

            await Repository.InsertAsync(form, autoSave: true);

            return ObjectMapper.Map<Form, FormDto>(form);
        }
        [Authorize(RavinaFaradidFormsPermissions.Forms.Create)]
        // ✅ ایجاد نسخه جدید (بدون توجه به شماره نسخه)
        public async Task<FormVersionDto> CreateNewVersionAsync(Guid formId, string jsonDefinition, string themeDefinition = null)
        {
            Check.NotNullOrWhiteSpace(jsonDefinition, nameof(jsonDefinition));

            var form = await Repository.GetAsync(formId);

            // نسخه جدید — این متد در دامنه باید وجود داشته باشد
            var version = form.CreateNewVersion(jsonDefinition, themeDefinition);

            await Repository.UpdateAsync(form, autoSave: true);

            return ObjectMapper.Map<FormVersion, FormVersionDto>(version);
        }
        [Authorize(RavinaFaradidFormsPermissions.Forms.Publish)]
        // ✅ انتشار نسخه خاص
        public async Task<FormVersionDto> PublishVersionAsync(Guid formId, Guid versionId)
        {
            var form = await Repository.GetAsync(formId);

            form.PublishVersion(versionId);

            await Repository.UpdateAsync(form, autoSave: true);

            var published = form.Versions.First(x => x.Id == versionId);
            return ObjectMapper.Map<FormVersion, FormVersionDto>(published);
        }
        [Authorize(RavinaFaradidFormsPermissions.Forms.Update)]
        // ✅ ایجاد نسخه بعدی (VersionNumber++ خودکار)
        public async Task<FormVersionDto> CreateNextVersionAsync(Guid formId, string jsonDefinition, string themeDefinition = null)
        {
            Check.NotNullOrWhiteSpace(jsonDefinition, nameof(jsonDefinition));

            var form = await Repository.GetAsync(formId);

            var nextVersion = form.CreateNextVersion(jsonDefinition, themeDefinition);

            await Repository.UpdateAsync(form, autoSave: true);

            return ObjectMapper.Map<FormVersion, FormVersionDto>(nextVersion);
        }
        [Authorize(RavinaFaradidFormsPermissions.Forms.Publish)]
        // ✅ لغو انتشار نسخه فعال فعلی
        public async Task<FormVersionDto> UnpublishCurrentVersionAsync(Guid formId)
        {
            var form = await Repository.GetAsync(formId);
            form.UnpublishCurrentVersion();

            await Repository.UpdateAsync(form, autoSave: true);

            var draft = form.Versions.FirstOrDefault(x => x.Status == FormVersionStatus.Draft);
            return ObjectMapper.Map<FormVersion, FormVersionDto>(draft);
        }
        [Authorize(RavinaFaradidFormsPermissions.Forms.Publish)]
        // ✅ بایگانی نسخه خاص
        public async Task<FormVersionDto> ArchiveVersionAsync(Guid formId, Guid versionId)
        {
            var form = await Repository.GetAsync(formId);
            form.ArchiveVersion(versionId);

            await Repository.UpdateAsync(form, autoSave: true);

            var archived = form.Versions.First(x => x.Id == versionId);
            return ObjectMapper.Map<FormVersion, FormVersionDto>(archived);
        }

    }
}
