using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RavinaFaradid.Forms.Permissions
{
    public static class RavinaFaradidFormsPermissions
    {
        public const string GroupName = "RavinaForms";

        public static class Forms
        {
            public const string Default = GroupName + ".Forms";            // خواندن/لیست
            public const string Create = GroupName + ".Forms.Create";
            public const string Update = GroupName + ".Forms.Update";
            public const string Delete = GroupName + ".Forms.Delete";
            public const string Publish = GroupName + ".Forms.Publish";
            public const string Assign = GroupName + ".Forms.Assign";
            public const string ManagePermissions = GroupName + ".Forms.ManagePermissions";

            // 🔸 شاخه‌ی Legacy برای سازگاری (به‌تدریج حذفش کن)
            //public const string FormDefault = GroupName + ".FormPermissions";
            //public const string View = FormDefault + ".View";    // فقط برای کد قدیمی
            //public const string Manage = FormDefault + ".Manage";  // فقط برای کد قدیمی
        }

        public static class Responses
        {
            public const string Default = GroupName + ".Responses";      // List/Get
            public const string Export = GroupName + ".Responses.Export";
            public const string Delete = GroupName + ".Responses.Delete";
        }

    }
}
