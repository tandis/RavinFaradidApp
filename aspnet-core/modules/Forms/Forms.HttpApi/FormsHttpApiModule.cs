using Volo.Abp.Modularity;
using Volo.Abp.AspNetCore.Mvc;
using Localization.Resources.AbpUi;
using static RavinaFaradid.Forms.FormsDomainSharedModule;
using Volo.Abp.Localization;
using Forms.Domain.Shared.Localization;
using RavinaFaradid.Forms.Application;

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