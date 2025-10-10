using Volo.Abp.Modularity;

namespace RavinaFaradid;

[DependsOn(
    typeof(RavinaFaradidApplicationModule),
    typeof(RavinaFaradidDomainTestModule)
)]
public class RavinaFaradidApplicationTestModule : AbpModule
{

}
