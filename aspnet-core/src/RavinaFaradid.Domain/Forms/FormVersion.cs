using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Volo.Abp;


namespace RavinaFaradid.Forms;


public class FormVersion : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; protected set; }
    public Guid FormId { get; protected set; }
    public int Version { get; protected set; }
    public string JsonDefinition { get; protected set; }


    protected FormVersion() { }


    public FormVersion(Guid id, Guid formId, int version, string json, Guid? tenantId) : base(id)
    {
        FormId = formId;
        Version = version;
        JsonDefinition = Check.NotNullOrWhiteSpace(json, nameof(json));
        TenantId = tenantId;
    }
}