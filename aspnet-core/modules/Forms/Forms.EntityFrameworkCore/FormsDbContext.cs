using RavinaFaradid.Forms.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

namespace RavinaFaradid.Forms.EntityFrameworkCore
{
    [ConnectionStringName("Default")] // یا اسم کانکشن استرینگ
    public class FormsDbContext : AbpDbContext<FormsDbContext>
    {
        public FormsDbContext(DbContextOptions<FormsDbContext> options)
            : base(options)
        {
            
        }

        public DbSet<Form> Forms { get; set; }
        public DbSet<FormCategory> FormCategories { get; set; }
        public DbSet<FormVersion> FormVersions { get; set; }
        public DbSet<FormResponse> FormResponses { get; set; }
        public DbSet<FormPermission> FormPermissions { get; set; }
        public DbSet<FormTemplate> FormTemplates { get; set; }
        public DbSet<FormAssignment> FormAssignments { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ConfigureForms(); // همون متد Extension که نوشتیم
        }
    }
}
