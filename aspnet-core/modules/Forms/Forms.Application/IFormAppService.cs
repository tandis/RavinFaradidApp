using RavinaFaradid.Forms.Application.Contracts.Dtos;
using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace RavinaFaradid.Forms.Application
{
    public interface IFormAppService :
        ICrudAppService<FormDto, Guid, PagedAndSortedResultRequestDto, CreateUpdateFormDto>, IApplicationService
    {
        Task<FormVersionDto> CreateNextVersionAsync(Guid formId, string jsonDefinition, string themeDefinition = null);
        Task<FormVersionDto> CreateNewVersionAsync(Guid formId, string jsonDefinition, string themeDefinition = null);
        Task<FormVersionDto> PublishVersionAsync(Guid formId, Guid versionId);

        Task<FormVersionDto> UnpublishCurrentVersionAsync(Guid formId);
        Task<FormVersionDto> ArchiveVersionAsync(Guid formId, Guid versionId);
    }
}
