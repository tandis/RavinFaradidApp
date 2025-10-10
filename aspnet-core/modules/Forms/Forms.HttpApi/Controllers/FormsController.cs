using System;
using System.Threading.Tasks;
using Asp.Versioning;
using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc;
using RavinaFaradid.Forms.Application;

namespace RavinaFaradid.Forms
{
    [RemoteService]
    [Area("app")]
    [ControllerName("FormCustom")]
    [Route("api/app/forms")]
    public class FormController : AbpController
    {
        private readonly FormAppService _formService;
        private readonly FormResponseAppService _responseService;

        public FormController(FormAppService formService, FormResponseAppService responseService)
        {
            _formService = formService;
            _responseService = responseService;
        }

        // 📌 ارسال پاسخ به فرم
        [HttpPost("{formId}/submit-response")]
        public async Task<FormResponseDto> SubmitResponseAsync(Guid formId, [FromBody] CreateFormResponseDto input)
        {
            input.FormId = formId; // مطمئن بشیم FormId از Route هم ست بشه
            return await _responseService.CreateAsync(input);
        }

        // 📌 انتشار/تخصیص فرم به کاربر یا نقش
        [HttpPost("{formId}/assign")]
        public async Task AssignAsync(Guid formId, [FromBody] FormAssignment input)
        {
            input.FormId = formId;
            // اینجا می‌تونی Repository یا AppService مربوط به Assignment رو صدا بزنی
            // مثلا: await _assignmentService.CreateAsync(input);
        }

        // 📌 کپی کردن فرم
        //[HttpPost("{formId}/clone")]
        //public async Task<FormDto> CloneAsync(Guid formId)
        //{
        //    var form = await _formService.GetAsync(formId);
        //    var clone = new CreateUpdateFormDto
        //    {
        //        Title = form.Title + " (Copy)",
        //        Description = form.Description,
        //        JsonDefinition = form,
        //        IsActive = false
        //    };
        //    return await _formService.CreateAsync(clone);
        //}

        // 📌 آمار فرم (نمونه ساده)
        [HttpGet("{formId}/stats")]
        public async Task<object> GetStatsAsync(Guid formId)
        {
            // نمونه: تعداد پاسخ‌ها
            var responses = await _responseService.GetListAsync(new Volo.Abp.Application.Dtos.PagedAndSortedResultRequestDto());
            var count = responses.TotalCount;
            return new { FormId = formId, ResponseCount = count };
        }

        [Route("api/app/form-templates")]
        public class FormTemplateController : AbpController
        {
            private readonly FormTemplateAppService _templateService;

            public FormTemplateController(FormTemplateAppService templateService)
            {
                _templateService = templateService;
            }

            // ساخت فرم از روی Template
            [HttpPost("{templateId}/create-form")]
            public Task<FormDto> CreateFormFromTemplateAsync(Guid templateId)
            {
                return _templateService.CreateFormFromTemplateAsync(templateId);
            }
        }

    }
}
