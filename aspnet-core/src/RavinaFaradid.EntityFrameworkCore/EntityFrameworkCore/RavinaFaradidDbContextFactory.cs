using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace RavinaFaradid.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class RavinaFaradidDbContextFactory : IDesignTimeDbContextFactory<RavinaFaradidDbContext>
{
    public RavinaFaradidDbContext CreateDbContext(string[] args)
    {
        RavinaFaradidEfCoreEntityExtensionMappings.Configure();

        var configuration = BuildConfiguration();

        var builder = new DbContextOptionsBuilder<RavinaFaradidDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));

        return new RavinaFaradidDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../RavinaFaradid.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}
