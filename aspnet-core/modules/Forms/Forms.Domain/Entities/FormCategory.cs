using RavinaFaradid.Forms;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace RavinaFaradid.Forms.Domain.Entities
{
    /// <summary>
    /// دسته‌بندی فرم‌ها (قابل چندسطحی)
    /// </summary>
    public class FormCategory : FullAuditedAggregateRoot<Guid>
    {
        public string Name { get; protected set; }
        public string Description { get; protected set; }
        public Guid? ParentCategoryId { get; protected set; }
        public Guid? TenantId { get; set; }

        [ForeignKey(nameof(ParentCategoryId))]
        public FormCategory ParentCategory { get; protected set; }

        public ICollection<FormCategory> Children { get; protected set; }
        public ICollection<Form> Forms { get; protected set; }

        protected FormCategory() { }

        public FormCategory(Guid id, string name, string description = null, Guid? parentId = null)
            : base(id)
        {
            Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 128);
            Description = description;
            ParentCategoryId = parentId;
            Children = new List<FormCategory>();
            Forms = new List<Form>();
        }

        public void Update(string name, string description)
        {
            Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 128);
            Description = description;
        }
    }
}
