using RavinaFaradid.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace RavinaFaradid.Permissions;

public class RavinaFaradidPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(RavinaFaradidPermissions.GroupName);
        //Define your own permissions here. Example:
        //myGroup.AddPermission(RavinaFaradidPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<RavinaFaradidResource>(name);
    }
}
