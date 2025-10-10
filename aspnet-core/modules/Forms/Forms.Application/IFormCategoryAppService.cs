using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Domain.Entities;
using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace RavinaFaradid.Forms.Application
{
    public interface IFormCategoryAppService: ICrudAppService<
        FormCategoryDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateUpdateFormCategoryDto>, IApplicationService
    {
    }
}
