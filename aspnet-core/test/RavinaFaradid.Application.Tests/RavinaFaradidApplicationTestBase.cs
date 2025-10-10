using Volo.Abp.Modularity;

namespace RavinaFaradid;

public abstract class RavinaFaradidApplicationTestBase<TStartupModule> : RavinaFaradidTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
