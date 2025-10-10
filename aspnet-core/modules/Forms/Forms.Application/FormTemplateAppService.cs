using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace RavinaFaradid.Forms.Application
{
    public class FormTemplateAppService : CrudAppService<
     FormTemplate, FormTemplateDto, Guid,
     PagedAndSortedResultRequestDto,
     CreateUpdateFormTemplateDto>, IFormTemplateAppService
    {
        public FormTemplateAppService(IRepository<FormTemplate, Guid> repository) : base(repository)
        {
        }

        // 📌 ساخت Form جدید از Template
        public async Task<FormDto> CreateFormFromTemplateAsync(Guid templateId)
        {
            var template = await Repository.GetAsync(templateId);
            var form = new CreateUpdateFormDto
            {
                Title = template.Name,
                Description = template.Description,
                JsonDefinition = template.JsonDefinition,
                IsActive = false
            };

            // صدا زدن FormAppService برای ایجاد فرم واقعی
            return await LazyServiceProvider.LazyGetRequiredService<FormAppService>()
                .CreateAsync(form);
        }
    }

}
