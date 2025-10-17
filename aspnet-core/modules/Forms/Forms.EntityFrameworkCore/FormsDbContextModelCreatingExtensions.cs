using RavinaFaradid.Forms.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp;
namespace RavinaFaradid.Forms.EntityFrameworkCore
{
    public static class FormsDbContextModelCreatingExtensions
    {
        public static void ConfigureForms(this ModelBuilder builder)
        {
            Check.NotNull(builder, nameof(builder));


            // ================================
            // 🧱 Table: FormCategories
            // ================================
            builder.Entity<FormCategory>(b =>
            {
                b.ToTable("FormCategories");

                b.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(128);

                b.Property(x => x.Description)
                    .HasMaxLength(512);

                b.HasOne(x => x.ParentCategory)
                    .WithMany(x => x.Children)
                    .HasForeignKey(x => x.ParentCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasMany(x => x.Forms)
                    .WithOne(x => x.Category)
                    .HasForeignKey(x => x.CategoryId);
            });

            // ================================
            // 🧱 Table: Forms
            // ================================
            builder.Entity<Form>(b =>
            {
                b.ToTable("Forms");

                b.Property(x => x.Title)
                    .IsRequired()
                    .HasMaxLength(256);

                b.Property(x => x.Description)
                    .HasMaxLength(1000);

                b.Property(x => x.IsActive)
                    .HasDefaultValue(true);

                b.Property(x => x.IsAnonymousAllowed)
                    .HasDefaultValue(false);

                b.HasOne(x => x.Category)
                    .WithMany(x => x.Forms)
                    .HasForeignKey(x => x.CategoryId)
                    .OnDelete(DeleteBehavior.SetNull);

                b.HasMany(x => x.Versions)
                    .WithOne(x => x.Form)
                    .HasForeignKey(x => x.FormId);

                b.HasMany(x => x.Responses)
                    .WithOne(x => x.Form)
                    .HasForeignKey(x => x.FormId);
            });



            // ================================
            // 🧱 Table: FormVersions
            // ================================
            builder.Entity<FormVersion>(b =>
            {
                b.ToTable("FormVersions");

                b.HasOne(x => x.Form)
           .WithMany(x => x.Versions)
           .HasForeignKey(x => x.FormId)
           .OnDelete(DeleteBehavior.Cascade);

                b.Property(x => x.JsonDefinition)
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");
                b.HasCheckConstraint("CK_FormVersion_Json_IsJson", "ISJSON([JsonDefinition])=1");

                b.Property(x => x.ThemeDefinition)
                    .HasColumnType("nvarchar(max)");
                b.HasCheckConstraint("CK_FormVersion_Theme_IsJson", "[ThemeDefinition] IS NULL OR ISJSON([ThemeDefinition])=1");

                b.Property(x => x.DefinitionHash)
                    .HasMaxLength(64);

                b.Property(x => x.VersionNumber)
                    .HasDefaultValue(0);

                b.Property(x => x.Status)
                    .HasConversion<string>() // ذخیره به صورت Draft/Published/Archived
                    .HasMaxLength(32)
                    .HasDefaultValue(FormVersionStatus.Draft);
                b.HasIndex(v => new { v.FormId, v.Status })
                    .IsUnique()
                    .HasFilter("[Status] = 0"); // SQL Server; برای PG از syntax خودش استفاده کن

                // جلوگیری از تکرار نسخه منتشرشده
                b.HasIndex(v => new { v.FormId, v.VersionNumber });
            });

            // ================================
            // 🧱 Table: FormResponses
            // ================================
            builder.Entity<FormResponse>(b =>
            {
                b.ToTable("FormResponses");

                b.HasOne(x => x.Form)
           .WithMany(x => x.Responses)
           .HasForeignKey(x => x.FormId)
           .OnDelete(DeleteBehavior.Restrict); // 🚫 حذف فرم، پاسخ‌ها را حذف نکند



                b.Property(x => x.ResponseData)
                    .IsRequired()
                    .HasColumnType("nvarchar(max)");
                b.HasCheckConstraint("CK_FormResponse_IsJson", "ISJSON([ResponseData])=1");

                b.Property(x => x.SubmittedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });

            // 📌 FormAssignment
            builder.Entity<FormAssignment>(b =>
            {
                b.ToTable("FormAssignments");
                b.ConfigureByConvention();
                b.HasOne(x => x.Form).WithMany().HasForeignKey(x => x.FormId);
            });

            // 📌 FormTemplates
            builder.Entity<FormTemplate>(b =>
            {
                b.ToTable("FormTemplates");
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                b.Property(x => x.Description).HasMaxLength(1024);
                b.Property(x => x.JsonDefinition).IsRequired();
            });

            // ================================
            // 🧱 Table: FormPermissions
            // ================================
            builder.Entity<FormPermission>(b =>
            {
                b.ToTable("FormPermissions");

                b.Property(x => x.PermissionLevel)
                    .HasConversion<string>()
                    .HasMaxLength(32)
                    .IsRequired();

                b.HasOne(x => x.Form)
                    .WithMany(x => x.Permissions)
                    .HasForeignKey(x => x.FormId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.FormId, x.UserId, x.RoleId })
                    .IsUnique(false);

                b.HasIndex(x => new { x.FormId, x.IsAnonymous, x.UserId, x.RoleId })
                    .IsUnique();

                b.HasCheckConstraint("CK_FormPermission_Principal",
                    "(IsAnonymous = 1 AND UserId IS NULL AND RoleId IS NULL) " +
                    "OR (IsAnonymous = 0 AND ((UserId IS NOT NULL AND RoleId IS NULL) OR (UserId IS NULL AND RoleId IS NOT NULL)))"
                );
            });


        }
    }
}
