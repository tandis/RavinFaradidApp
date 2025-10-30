using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using System.Linq.Dynamic.Core;

namespace RavinaFaradid.Forms.Application
{
    public class FormResponseAppService : CrudAppService<
  FormResponse, FormResponseDto, Guid,
  PagedAndSortedResultRequestDto,
  CreateFormResponseDto>, IFormResponseAppService
    {
        private readonly IRepository<Form, Guid> _formRepo;
        private readonly IRepository<FormVersion, Guid> _versionRepo;
        public FormResponseAppService(IRepository<FormResponse, Guid> repository,
            IRepository<Form, Guid> formRepo,
            IRepository<FormVersion, Guid> versionRepo) : base(repository)
        {
            _formRepo = formRepo;
            _versionRepo = versionRepo;

        }

        /// <summary>
        /// پاسخ‌های فرم بر اساس آخرین نسخه‌ی Published، همراه با صفحه‌بندی/مرتب‌سازی.
        /// </summary>

        public virtual async Task<PagedResultDto<FormResponseDto>> GetByLatestPublishedAsync(
            Guid formId,
            PagedAndSortedResultRequestDto input)
        {
            if (formId == Guid.Empty)
                throw new BusinessException(code: "Forms:InvalidFormId").WithData("formId", formId);

            // 1) تلاش اول: از Form.PublishedVersionId (اگر مقداردهی شده) استفاده کن
            var form = await _formRepo.FirstOrDefaultAsync(f => f.Id == formId);
            if (form == null)
                return new PagedResultDto<FormResponseDto>(0, new List<FormResponseDto>());

            Guid? publishedVersionId = form.PublishedVersionId;

            // 2) اگر خالی بود، آخرین نسخه Published را پیدا کن
            if (!publishedVersionId.HasValue)
            {
                var vq = await _versionRepo.GetQueryableAsync();
                var latestPublished = await AsyncExecuter.FirstOrDefaultAsync(
                    vq.Where(v => v.FormId == formId && v.Status == FormVersionStatus.Published)
                      .OrderByDescending(v => v.VersionNumber)
                );
                publishedVersionId = latestPublished?.Id;

                if (!publishedVersionId.HasValue)
                    return new PagedResultDto<FormResponseDto>(0, new List<FormResponseDto>());
            }

            // 3) فیلتر پاسخ‌ها بر اساس FormId + PublishedVersionId
            var rq = await Repository.GetQueryableAsync();
            var query = rq.Where(r => r.FormId == formId && r.FormVersionId == publishedVersionId.Value);

            // 4) مرتب‌سازی (fallback اگر input.Sorting خالی بود)
            // مثال: "CreationTime DESC" یا "SubmittedAt DESC"
            var sorting = string.IsNullOrWhiteSpace(input.Sorting)
                ? "CreationTime DESC"
                : input.Sorting;

            query = query.OrderBy(sorting); // Volo.Abp.Linq  از System.Linq.Dynamic.Core استفاده می‌کند

            // 5) Count + صفحه‌بندی
            var totalCount = await AsyncExecuter.CountAsync(query);
            var items = await AsyncExecuter.ToListAsync(
                query.Skip(input.SkipCount).Take(input.MaxResultCount)
            );

            // 6) Map به DTO
            var dtos = ObjectMapper.Map<List<FormResponse>, List<FormResponseDto>>(items);
            return new PagedResultDto<FormResponseDto>(totalCount, dtos);
        }
    }
}
