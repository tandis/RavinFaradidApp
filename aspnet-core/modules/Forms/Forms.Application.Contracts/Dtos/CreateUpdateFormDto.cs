using Abp.AutoMapper;
using AutoMapper;
using RavinaFaradid.Forms.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
namespace RavinaFaradid.Forms.Application.Contracts.Dtos

{
    [AutoMapTo(typeof(Form))]
    public class CreateUpdateFormDto: FullAuditedEntityDto<Guid>
    {
        internal readonly object PublishedVersionId;

        /// <summary>
        /// عنوان فرم (الزامی)
        /// </summary>
        [Required]
            [StringLength(256)]
            public string Title { get; set; }

            /// <summary>
            /// توضیحات فرم (اختیاری)
            /// </summary>
            [StringLength(1000)]
            public string Description { get; set; }

            /// <summary>
            /// شناسه دسته‌بندی فرم (اختیاری)
            /// </summary>
            public Guid? CategoryId { get; set; }

            /// <summary>
            /// آیا فرم فعال است؟
            /// </summary>
            public bool IsActive { get; set; } = true;

            /// <summary>
            /// آیا این فرم برای کاربران ناشناس قابل دسترسی است؟
            /// </summary>
            public bool IsAnonymousAllowed { get; set; } = false;

            /// <summary>
            /// تعریف اصلی فرم در قالب JSON (SurveyJS JSON)
            /// </summary>
            [Required]
            public string JsonDefinition { get; set; }

            /// <summary>
            /// تنظیمات ظاهری یا تم فرم (اختیاری)
            /// </summary>
            public string ThemeDefinition { get; set; }
        }
    
}
