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
    public class FormResponseAppService : CrudAppService<
  FormResponse, FormResponseDto, Guid,
  PagedAndSortedResultRequestDto,
  CreateFormResponseDto>, IFormResponseAppService
    {
        public FormResponseAppService(IRepository<FormResponse, Guid> repository) : base(repository)
        {
        }
    }
}
