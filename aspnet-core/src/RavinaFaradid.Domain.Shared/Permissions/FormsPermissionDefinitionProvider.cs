using RavinaFaradid.Forms.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;


namespace RavinaFaradid.Forms.Permissions;


public class FormsPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var group = context.AddGroup("Forms");
        var forms = group.AddPermission("Forms.Default", L("Permission:Forms"));
        forms.AddChild("Forms.Manage", L("Permission:Forms.Manage"));
        forms.AddChild("Forms.Responses", L("Permission:Forms.Responses"));
    }


    private static LocalizableString L(string name) => LocalizableString.Create<FormsResource>(name);
}