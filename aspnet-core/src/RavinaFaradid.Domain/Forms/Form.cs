using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Volo.Abp;


namespace RavinaFaradid.Forms;


public class Form : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; protected set; }
    public string Title { get; protected set; }
    public string? Description { get; protected set; }
    public string JsonDefinition { get; protected set; }
    public string DefaultLanguage { get; protected set; }
    public int Version { get; protected set; }
    public bool AllowAnonymousResponses { get; protected set; }


    protected Form() { }


    public Form(Guid id, string title, string json, string defaultLang, Guid? tenantId, bool allowAnonymous = false)
    : base(id)
    {
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), 256);
        JsonDefinition = Check.NotNullOrWhiteSpace(json, nameof(json));
        DefaultLanguage = Check.NotNullOrWhiteSpace(defaultLang, nameof(defaultLang), 10);
        TenantId = tenantId;
        Version = 1;
        AllowAnonymousResponses = allowAnonymous;
    }


    public void Update(string title, string? description, string json, string defaultLang)
    {
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), 256);
        Description = description;
        JsonDefinition = Check.NotNullOrWhiteSpace(json, nameof(json));
        DefaultLanguage = Check.NotNullOrWhiteSpace(defaultLang, nameof(defaultLang), 10);
        Version++;
    }
}
