using Volo.Abp.Modularity;

namespace RavinaFaradid.Forms{
[DependsOn(typeof(FormsDomainSharedModule))] 
    public class FormsApplicationContractsModule: AbpModule{
    }
}