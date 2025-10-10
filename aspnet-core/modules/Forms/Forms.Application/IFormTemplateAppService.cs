using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace RavinaFaradid.Forms.Application
{
    public interface IFormTemplateAppService: ICrudAppService<
     FormTemplateDto, Guid,
     PagedAndSortedResultRequestDto,
     CreateUpdateFormTemplateDto>, IApplicationService
    {
        Task<FormDto> CreateFormFromTemplateAsync(Guid templateId);
    }
}
