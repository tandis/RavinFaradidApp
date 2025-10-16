using RavinaFaradid.Forms.Domain.Shared.Localization;
using Localization.Resources.AbpUi;
using Volo.Abp.Authorization;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.Authorization.Permissions;

namespace RavinaFaradid.Forms{
[DependsOn(typeof(AbpAuthorizationModule))] 
    public class FormsDomainSharedModule: AbpModule
    {
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Add<FormsResource>("fa")
                    .AddVirtualJson("/Localization/Forms");
     
                options.DefaultResourceType = typeof(FormsResource);
                options.Languages.Add(new LanguageInfo("fa", "fa", "فارسی"));
            });
            Configure<AbpPermissionOptions>(options =>
            {
                options.DefinitionProviders.Add<RavinaFormsPermissionDefinitionProvider>();
            });
        }

    }
}