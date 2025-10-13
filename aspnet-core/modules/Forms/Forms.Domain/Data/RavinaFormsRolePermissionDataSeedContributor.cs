using RavinaFaradid.Forms.Permissions;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.PermissionManagement;


namespace RavinaFaradid.Forms.Domain.Data
{
    public class RavinaFormsRolePermissionDataSeedContributor : IDataSeedContributor, ITransientDependency

    {
        private readonly IPermissionDataSeeder _permissionDataSeeder;

        public RavinaFormsRolePermissionDataSeedContributor(IPermissionDataSeeder permissionDataSeeder)
        {
            _permissionDataSeeder = permissionDataSeeder;
        }

        public async Task SeedAsync(DataSeedContext context)
        {
            var formAll = new[]
            {
            RavinaFaradidFormsPermissions.Forms.Default,
            RavinaFaradidFormsPermissions.Forms.Create,
            RavinaFaradidFormsPermissions.Forms.Update,
            RavinaFaradidFormsPermissions.Forms.Delete,
            RavinaFaradidFormsPermissions.Forms.Publish,
            RavinaFaradidFormsPermissions.Forms.Assign,
            RavinaFaradidFormsPermissions.Forms.ManagePermissions
        };

            var respAll = new[]
            {
            RavinaFaradidFormsPermissions.Responses.Default,
            RavinaFaradidFormsPermissions.Responses.Export,
            RavinaFaradidFormsPermissions.Responses.Delete
        };

            // Admin: همهٔ فرم + پاسخ‌ها
            await _permissionDataSeeder.SeedAsync("Admin", null, formAll.Concat(respAll).ToArray());

            // FormManager
            await _permissionDataSeeder.SeedAsync("FormManager", null, formAll.Concat(respAll).ToArray());

            // FormEditor
            await _permissionDataSeeder.SeedAsync("FormEditor", null, new[]
            {
            RavinaFaradidFormsPermissions.Forms.Default,
            RavinaFaradidFormsPermissions.Forms.Create,
            RavinaFaradidFormsPermissions.Forms.Update
        });

            // FormViewer
            await _permissionDataSeeder.SeedAsync("FormViewer", null, new[]
            {
            RavinaFaradidFormsPermissions.Forms.Default
        });

            // Analyst
            await _permissionDataSeeder.SeedAsync("Analyst", null, new[]
            {
            RavinaFaradidFormsPermissions.Responses.Default,
            RavinaFaradidFormsPermissions.Responses.Export
        });
        }
    }
}