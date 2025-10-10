using RavinaFaradid.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace RavinaFaradid.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(RavinaFaradidEntityFrameworkCoreModule),
    typeof(RavinaFaradidApplicationContractsModule)
    )]
public class RavinaFaradidDbMigratorModule : AbpModule
{
}
