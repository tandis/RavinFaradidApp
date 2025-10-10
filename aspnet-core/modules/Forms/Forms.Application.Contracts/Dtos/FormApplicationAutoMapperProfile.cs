using AutoMapper;
using RavinaFaradid.Forms.Domain.Entities;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class FormApplicationAutoMapperProfile : Profile
    {
        public FormApplicationAutoMapperProfile()
        {
            CreateMap<Form, FormDto>();
            CreateMap<CreateUpdateFormDto, Form>()
             .ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.TenantId, opt => opt.Ignore())
            .ForMember(d => d.ExtraProperties, opt => opt.Ignore())
            .ForMember(d => d.ConcurrencyStamp, opt => opt.Ignore())
            .ForMember(d => d.CreationTime, opt => opt.Ignore())
            .ForMember(d => d.CreatorId, opt => opt.Ignore())
            .ForMember(d => d.LastModificationTime, opt => opt.Ignore())
            .ForMember(d => d.LastModifierId, opt => opt.Ignore())
            .ForMember(d => d.IsDeleted, opt => opt.Ignore())
            .ForMember(d => d.DeleterId, opt => opt.Ignore())
            .ForMember(d => d.DeletionTime, opt => opt.Ignore())
            // ناوبری‌ها/کلکشن‌هایی که از DTO نمی‌آیند
            .ForMember(d => d.Category, opt => opt.Ignore())
            .ForMember(d => d.Versions, opt => opt.Ignore())
            .ForMember(d => d.Responses, opt => opt.Ignore())
            .ForMember(d => d.Permissions, opt => opt.Ignore())
            // نگاشت فیلدهایی که در DTO داری
            .ForMember(d => d.PublishedVersionId, opt => opt.MapFrom(s => s.PublishedVersionId))
            .ForMember(d => d.CategoryId, opt => opt.MapFrom(s => s.CategoryId));



            CreateMap<FormVersion, FormVersionDto>();
            CreateMap<FormResponse, FormResponseDto>();

            CreateMap<FormCategory, FormCategoryDto>();
            CreateMap<CreateUpdateFormCategoryDto, FormCategory>().ForMember(d => d.Id, opt => opt.Ignore())
            .ForMember(d => d.TenantId, opt => opt.Ignore())
            .ForMember(d => d.ParentCategory, opt => opt.Ignore())
            .ForMember(d => d.Children, opt => opt.Ignore())
            .ForMember(d => d.Forms, opt => opt.Ignore())
            .ForMember(d => d.IsDeleted, opt => opt.Ignore())
            .ForMember(d => d.DeleterId, opt => opt.Ignore())
            .ForMember(d => d.DeletionTime, opt => opt.Ignore())
            .ForMember(d => d.LastModificationTime, opt => opt.Ignore())
            .ForMember(d => d.LastModifierId, opt => opt.Ignore())
            .ForMember(d => d.CreationTime, opt => opt.Ignore())
            .ForMember(d => d.CreatorId, opt => opt.Ignore())
            .ForMember(d => d.ExtraProperties, opt => opt.Ignore())
            .ForMember(d => d.ConcurrencyStamp, opt => opt.Ignore())
            // اگر در DTO شناسه والد داری، نگاشتش کن:
            .ForMember(d => d.ParentCategoryId, opt => opt.MapFrom(s => s.ParentCategoryId));
        }
    }
}
