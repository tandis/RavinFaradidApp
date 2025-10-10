using System;
using System.Collections.Generic;
using System.Text;
using RavinaFaradid.Localization;
using Volo.Abp.Application.Services;

namespace RavinaFaradid;

/* Inherit your application services from this class.
 */
public abstract class RavinaFaradidAppService : ApplicationService
{
    protected RavinaFaradidAppService()
    {
        LocalizationResource = typeof(RavinaFaradidResource);
    }
}
