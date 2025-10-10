using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace RavinaFaradid.Data;

/* This is used if database provider does't define
 * IRavinaFaradidDbSchemaMigrator implementation.
 */
public class NullRavinaFaradidDbSchemaMigrator : IRavinaFaradidDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
