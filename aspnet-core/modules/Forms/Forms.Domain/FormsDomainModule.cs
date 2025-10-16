using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;

namespace RavinaFaradid.Forms{
[DependsOn(typeof(FormsDomainSharedModule), typeof(AbpPermissionManagementDomainModule), typeof(AbpIdentityDomainModule))] 
    public class FormsDomainModule: AbpModule{}
}