using System.ComponentModel.DataAnnotations;
using System;
using Volo.Abp.Application.Dtos;
using System.Collections.Generic;
using Abp.AutoMapper;
using RavinaFaradid.Forms.Domain.Entities;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos;
[AutoMapFrom(typeof(Form))]
public class FormDto : AuditedEntityDto<Guid>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? PublishedVersionId { get; set; }

    public FormCategoryDto Category { get; set; }
    public List<FormVersionDto> Versions { get; set; }

}