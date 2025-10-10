using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace RavinaFaradid.Forms.EntityFrameworkCore
{
    /* This class is needed for EF Core console commands
     * (like Add-Migration and Update-Database commands) */
    public class FormsDbContextFactory : IDesignTimeDbContextFactory<FormsDbContext>
    {
        public FormsDbContext CreateDbContext(string[] args)
        {
            var configuration = BuildConfiguration();

            var builder = new DbContextOptionsBuilder<FormsDbContext>()
                .UseSqlServer(configuration.GetConnectionString("Default")); // یا کانکشن استرینگ مخصوص ماژول

            return new FormsDbContext(builder.Options);
        }

        private static IConfigurationRoot BuildConfiguration()
        {
            // ✅ استفاده از روش استاندارد و قوی برای پیدا کردن تنظیمات
            var builder = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../RavinaFaradid.DbMigrator/"))
                .AddJsonFile("appsettings.json", optional: false);

            return builder.Build();
        }
    }
}