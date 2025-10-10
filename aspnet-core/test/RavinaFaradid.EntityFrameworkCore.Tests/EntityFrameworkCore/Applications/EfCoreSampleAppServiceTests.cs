using RavinaFaradid.Samples;
using Xunit;

namespace RavinaFaradid.EntityFrameworkCore.Applications;

[Collection(RavinaFaradidTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<RavinaFaradidEntityFrameworkCoreTestModule>
{

}
