using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;

namespace RavinaFaradid.Forms{
[DependsOn(typeof(FormsDomainSharedModule), typeof(AbpPermissionManagementDomainModule))] 
    public class FormsDomainModule: AbpModule{}
}