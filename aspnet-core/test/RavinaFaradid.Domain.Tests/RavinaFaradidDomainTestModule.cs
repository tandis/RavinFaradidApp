using Volo.Abp.Modularity;

namespace RavinaFaradid;

[DependsOn(
    typeof(RavinaFaradidDomainModule),
    typeof(RavinaFaradidTestBaseModule)
)]
public class RavinaFaradidDomainTestModule : AbpModule
{

}
