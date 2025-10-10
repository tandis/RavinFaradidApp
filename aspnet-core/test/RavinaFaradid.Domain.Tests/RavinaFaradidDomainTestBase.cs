using Volo.Abp.Modularity;

namespace RavinaFaradid;

/* Inherit from this class for your domain layer tests. */
public abstract class RavinaFaradidDomainTestBase<TStartupModule> : RavinaFaradidTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
