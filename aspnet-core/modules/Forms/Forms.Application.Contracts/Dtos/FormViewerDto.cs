using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class FormViewerDto
    {
        public Guid FormId { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public bool IsAnonymousAllowed { get; set; }
        public FormViewerVersionDto? PublishedVersion { get; set; }
    }
}
