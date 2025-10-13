using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RavinaFaradid.Forms.Application.Contracts.Dtos
{
    public class FormViewerVersionDto
    {
        public Guid Id { get; set; }
        public int VersionNumber { get; set; }
        public DateTime? PublishedAt { get; set; }
        public object SchemaJson { get; set; } = default!;   // از JsonDefinition پر می‌شود
        public object? ThemeJson { get; set; }               // از ThemeDefinition
    }
}
