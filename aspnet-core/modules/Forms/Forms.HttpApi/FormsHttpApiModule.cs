using Volo.Abp.Modularity;
using Volo.Abp.AspNetCore.Mvc;
using Localization.Resources.AbpUi;
using static RavinaFaradid.Forms.FormsDomainSharedModule;
using Volo.Abp.Localization;

using RavinaFaradid.Forms.Application;
using RavinaFaradid.Forms.Domain.Shared.Localization;

namespace RavinaFaradid.Forms
{
    [DependsOn(typeof(FormsApplicationContractsModule),typeof(AbpAspNetCoreMvcModule))] 
    public class FormsHttpApiModule: AbpModule{
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            Configure<AbpAspNetCoreMvcOptions>(options =>
            {
                options.ConventionalControllers.Create(typeof(FormsApplicationModule).Assembly);
            });
            Configure<AbpLocalizationOptions>(options =>
            {
                options.Resources
                    .Get<FormsResource>()
                    .AddBaseTypes(typeof(AbpUiResource)); // برای UI Angular
            });
        }

    }
}