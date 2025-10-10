using RavinaFaradid.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace RavinaFaradid.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class RavinaFaradidController : AbpControllerBase
{
    protected RavinaFaradidController()
    {
        LocalizationResource = typeof(RavinaFaradidResource);
    }
}
