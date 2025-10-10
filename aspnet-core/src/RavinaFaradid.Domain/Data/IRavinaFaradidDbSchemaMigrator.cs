using System.Threading.Tasks;

namespace RavinaFaradid.Data;

public interface IRavinaFaradidDbSchemaMigrator
{
    Task MigrateAsync();
}
