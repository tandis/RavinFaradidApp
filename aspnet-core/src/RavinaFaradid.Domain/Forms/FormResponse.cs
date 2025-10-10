using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;
using Volo.Abp;


namespace RavinaFaradid.Forms;


public class FormResponse : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; protected set; }
    public Guid FormId { get; protected set; }
    public Guid? UserId { get; protected set; }
    public bool IsPartial { get; protected set; }
    public string AnswersJson { get; protected set; }


    protected FormResponse() { }


    public FormResponse(Guid id, Guid formId, Guid? userId, string answersJson, bool isPartial, Guid? tenantId)
    : base(id)
    {
        FormId = formId;
        UserId = userId;
        AnswersJson = Check.NotNullOrWhiteSpace(answersJson, nameof(answersJson));
        IsPartial = isPartial;
        TenantId = tenantId;
    }


    public void MarkCompleted() => IsPartial = false;
}