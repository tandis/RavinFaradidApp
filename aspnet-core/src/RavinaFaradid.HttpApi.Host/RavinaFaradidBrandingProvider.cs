using Microsoft.Extensions.Localization;
using RavinaFaradid.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace RavinaFaradid;

[Dependency(ReplaceServices = true)]
public class RavinaFaradidBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<RavinaFaradidResource> _localizer;

    public RavinaFaradidBrandingProvider(IStringLocalizer<RavinaFaradidResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
