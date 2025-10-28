using Microsoft.Extensions.DependencyInjection;
using RavinaFaradid.Forms.Application.Mapping;
using Volo.Abp.AutoMapper;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;

namespace RavinaFaradid.Forms.Application
{
[DependsOn(typeof(FormsApplicationContractsModule),
        typeof(FormsDomainModule), 
        typeof(AbpIdentityDomainModule),
        typeof(AbpAutoMapperModule)
        )] 
    public class FormsApplicationModule: AbpModule{
        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            // برای تزریق IObjectMapper<FormsApplicationModule>
            context.Services.AddAutoMapperObjectMapper<FormsApplicationModule>();

            Configure<AbpAutoMapperOptions>(options =>
            {
                // تمام Profileهای داخل همین اسمبلی را ثبت می‌کند
                options.AddMaps<FormsApplicationModule>(validate: true);                   // پروفایل‌ها/اتریبیوت‌های همین اسمبلی
                options.AddMaps<FormsApplicationContractsModule>(validate: true);
            });
        }
    }
}