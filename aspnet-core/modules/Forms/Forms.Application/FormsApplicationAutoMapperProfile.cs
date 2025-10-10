using AutoMapper;
using RavinaFaradid.Forms.Application.Contracts.Dtos;
using RavinaFaradid.Forms.Domain.Entities;
namespace RavinaFaradid.Forms.Application
{
    public class FormsApplicationAutoMapperProfile:Profile
    {
        public FormsApplicationAutoMapperProfile()
        {
            // Entity -> DTO
            CreateMap<Form, FormDto>();
            // .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id)) // معمولاً لازم نیست
            // .ForMember(d => d.Fields, opt => opt.MapFrom(s => s.Fields));

            // CreateMap<FormField, FormFieldDto>();

            // DTO (Create/Update) -> Entity
            CreateMap<Form,CreateUpdateFormDto>();
              //  .ForMember(d => d.Id, opt => opt.Ignore())      // Id را از ورودی نگیریم
              //  .ForMember(d => d.Fields, opt => opt.MapFrom(s => s.Fields));

            //CreateMap<CreateUpdateFormFieldDto, FormField>();
        }
    }
}
