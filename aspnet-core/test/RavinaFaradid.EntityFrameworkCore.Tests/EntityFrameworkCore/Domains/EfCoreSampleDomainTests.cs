using RavinaFaradid.Samples;
using Xunit;

namespace RavinaFaradid.EntityFrameworkCore.Domains;

[Collection(RavinaFaradidTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<RavinaFaradidEntityFrameworkCoreTestModule>
{

}
