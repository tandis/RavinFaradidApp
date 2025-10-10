using Volo.Abp.Modularity;
using Volo.Abp.EntityFrameworkCore;

namespace RavinaFaradid.Forms.EntityFrameworkCore
{
[DependsOn(typeof(FormsDomainModule),typeof(AbpEntityFrameworkCoreModule))] 
    public class FormsEntityFrameworkCoreModule: AbpModule{
    }
}