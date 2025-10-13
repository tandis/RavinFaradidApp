
using RavinaFaradid.Forms.Domain.Shared.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace RavinaFaradid.Forms.Permissions
{
    public class RavinaFormsPermissionDefinitionProvider : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var group = context.AddGroup(RavinaFaradidFormsPermissions.GroupName, L("Permission:RavinaForms"));

            var forms = group.AddPermission(RavinaFaradidFormsPermissions.Forms.Default, L("Permission:Forms"));
            forms.AddChild(RavinaFaradidFormsPermissions.Forms.Create, L("Permission:Forms.Create"));
            forms.AddChild(RavinaFaradidFormsPermissions.Forms.Update, L("Permission:Forms.Update"));
            forms.AddChild(RavinaFaradidFormsPermissions.Forms.Delete, L("Permission:Forms.Delete"));
            forms.AddChild(RavinaFaradidFormsPermissions.Forms.Publish, L("Permission:Forms.Publish"));
            forms.AddChild(RavinaFaradidFormsPermissions.Forms.Assign, L("Permission:Forms.Assign"));
            forms.AddChild(RavinaFaradidFormsPermissions.Forms.ManagePermissions, L("Permission:Forms.ManagePermissions"));

            var responses = group.AddPermission(RavinaFaradidFormsPermissions.Responses.Default, L("Permission:Responses"));
            responses.AddChild(RavinaFaradidFormsPermissions.Responses.Export, L("Permission:Responses.Export"));
            responses.AddChild(RavinaFaradidFormsPermissions.Responses.Delete, L("Permission:Responses.Delete"));
        }

        private static LocalizableString L(string name) =>
            LocalizableString.Create<FormsResource>(name); // ریسورس خود ماژول
    }
}
