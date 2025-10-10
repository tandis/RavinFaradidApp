using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Application;
using RavinaFaradid.Forms.Domain.Entities;
using System.Linq;

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
        public FormAppService(IRepository<Form, Guid> repository)
            : base(repository)
        {
        }

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
            form.PublishVersion(version.Id);

            await Repository.InsertAsync(form, autoSave: true);

            return ObjectMapper.Map<Form, FormDto>(form);
        }

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

        // ✅ انتشار نسخه خاص
        public async Task<FormVersionDto> PublishVersionAsync(Guid formId, Guid versionId)
        {
            var form = await Repository.GetAsync(formId);

            form.PublishVersion(versionId);

            await Repository.UpdateAsync(form, autoSave: true);

            var published = form.Versions.First(x => x.Id == versionId);
            return ObjectMapper.Map<FormVersion, FormVersionDto>(published);
        }

        // ✅ ایجاد نسخه بعدی (VersionNumber++ خودکار)
        public async Task<FormVersionDto> CreateNextVersionAsync(Guid formId, string jsonDefinition, string themeDefinition = null)
        {
            Check.NotNullOrWhiteSpace(jsonDefinition, nameof(jsonDefinition));

            var form = await Repository.GetAsync(formId);

            var nextVersion = form.CreateNextVersion(jsonDefinition, themeDefinition);

            await Repository.UpdateAsync(form, autoSave: true);

            return ObjectMapper.Map<FormVersion, FormVersionDto>(nextVersion);
        }

        // ✅ لغو انتشار نسخه فعال فعلی
        public async Task<FormVersionDto> UnpublishCurrentVersionAsync(Guid formId)
        {
            var form = await Repository.GetAsync(formId);
            form.UnpublishCurrentVersion();

            await Repository.UpdateAsync(form, autoSave: true);

            var draft = form.Versions.FirstOrDefault(x => x.Status == FormVersionStatus.Draft);
            return ObjectMapper.Map<FormVersion, FormVersionDto>(draft);
        }

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
