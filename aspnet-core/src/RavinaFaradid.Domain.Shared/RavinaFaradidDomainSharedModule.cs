using RavinaFaradid.Forms;
using RavinaFaradid.Localization;
using System.ComponentModel;
using System.Linq;
using Volo.Abp.AuditLogging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Localization.ExceptionHandling;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.TenantManagement;
using Volo.Abp.Validation.Localization;
using Volo.Abp.VirtualFileSystem;

namespace RavinaFaradid;

[DependsOn(
    typeof(AbpAuditLoggingDomainSharedModule),
    typeof(AbpBackgroundJobsDomainSharedModule),
    typeof(AbpFeatureManagementDomainSharedModule),
    typeof(AbpIdentityDomainSharedModule),
    typeof(AbpOpenIddictDomainSharedModule),
    typeof(AbpPermissionManagementDomainSharedModule),
    typeof(AbpSettingManagementDomainSharedModule),
    typeof(AbpTenantManagementDomainSharedModule),
    typeof(FormsDomainSharedModule)
    )]
public class RavinaFaradidDomainSharedModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        RavinaFaradidGlobalFeatureConfigurator.Configure();
        RavinaFaradidModuleExtensionConfigurator.Configure();
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpVirtualFileSystemOptions>(options =>
        {
            options.FileSets.AddEmbedded<RavinaFaradidDomainSharedModule>();
        });

        Configure<AbpLocalizationOptions>(options =>
        {
            options.Resources
                .Add<RavinaFaradidResource>("fa")
                .AddBaseTypes(typeof(AbpValidationResource))
                .AddVirtualJson("/Localization/RavinaFaradid");

            options.DefaultResourceType = typeof(RavinaFaradidResource);
            options.Languages.Add(new LanguageInfo("fa", "fa","فارسی"));

        });

        //Configure<AbpExceptionLocalizationOptions>(options =>
        //{
        //    options.MapCodeNamespace("RavinaFaradid", typeof(RavinaFaradidResource));
        //});
    }
}
