using Microsoft.EntityFrameworkCore;

namespace RavinaFaradid.Forms.EntityFrameworkCore;


public static class FormsDbContextModelCreatingExtensions
{
    public static void ConfigureForms(this ModelBuilder builder)
    {
        builder.Entity<Form>(b =>
        {
            b.ToTable("Forms");
            b.Property(x => x.Title).IsRequired().HasMaxLength(256);
            b.Property(x => x.DefaultLanguage).IsRequired().HasMaxLength(10);
            b.Property(x => x.JsonDefinition).IsRequired();
            b.HasIndex(x => new { x.TenantId, x.Title });
        });


        builder.Entity<FormVersion>(b =>
        {
            b.ToTable("FormVersions");
            b.Property(x => x.JsonDefinition).IsRequired();
            b.HasIndex(x => new { x.FormId, x.Version }).IsUnique();
        });


        builder.Entity<FormResponse>(b =>
        {
            b.ToTable("FormResponses");
            b.Property(x => x.AnswersJson).IsRequired();
            b.HasIndex(x => new { x.TenantId, x.FormId, x.IsPartial });
        });
    }
}