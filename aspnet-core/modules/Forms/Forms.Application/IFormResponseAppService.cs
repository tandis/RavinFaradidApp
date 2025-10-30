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
    public interface IFormResponseAppService: ICrudAppService<
  FormResponseDto, Guid,
  PagedAndSortedResultRequestDto,
  CreateFormResponseDto>, IApplicationService
    {
        Task<PagedResultDto<FormResponseDto>> GetByLatestPublishedAsync(
            Guid formId,
            PagedAndSortedResultRequestDto input);
    }
}
