param(
    [string]$ModuleName = "Forms",
    [string]$RootPath = "modules",
    [string]$HostProjectPath = "src/RavinaFaradid.HttpApi.Host"
)

function Write-Utf8File($path, $content) {
    $dir = Split-Path $path
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    Set-Content -Path $path -Value $content -Encoding UTF8
}

$basePath = Join-Path $RootPath $ModuleName

# ===== Create folders =====
$projects = @(
    "$ModuleName.Domain.Shared",
    "$ModuleName.Domain",
    "$ModuleName.Application.Contracts",
    "$ModuleName.Application",
    "$ModuleName.EntityFrameworkCore",
    "$ModuleName.HttpApi"
)
foreach ($proj in $projects) {
    New-Item -ItemType Directory -Force -Path (Join-Path $basePath $proj) | Out-Null
}

# ===== csproj files with references =====
$rootAbpVersion = "9.*"

Write-Utf8File (Join-Path $basePath "$ModuleName.Domain.Shared/$ModuleName.Domain.Shared.csproj") @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Volo.Abp" Version="$rootAbpVersion" />
    <PackageReference Include="Volo.Abp.Authorization" Version="$rootAbpVersion" />
  </ItemGroup>
</Project>
"@

Write-Utf8File (Join-Path $basePath "$ModuleName.Domain/$ModuleName.Domain.csproj") @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Volo.Abp.Ddd.Domain" Version="$rootAbpVersion" />
    <PackageReference Include="Volo.Abp.MultiTenancy" Version="$rootAbpVersion" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\\$ModuleName.Domain.Shared\\$ModuleName.Domain.Shared.csproj" />
  </ItemGroup>
</Project>
"@

Write-Utf8File (Join-Path $basePath "$ModuleName.Application.Contracts/$ModuleName.Application.Contracts.csproj") @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Volo.Abp.Ddd.Application.Contracts" Version="$rootAbpVersion" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\\$ModuleName.Domain.Shared\\$ModuleName.Domain.Shared.csproj" />
  </ItemGroup>
</Project>
"@

Write-Utf8File (Join-Path $basePath "$ModuleName.Application/$ModuleName.Application.csproj") @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Volo.Abp.Ddd.Application" Version="$rootAbpVersion" />
    <PackageReference Include="Volo.Abp.AutoMapper" Version="$rootAbpVersion" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\\$ModuleName.Application.Contracts\\$ModuleName.Application.Contracts.csproj" />
    <ProjectReference Include="..\\$ModuleName.Domain\\$ModuleName.Domain.csproj" />
  </ItemGroup>
</Project>
"@

Write-Utf8File (Join-Path $basePath "$ModuleName.EntityFrameworkCore/$ModuleName.EntityFrameworkCore.csproj") @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Volo.Abp.EntityFrameworkCore" Version="$rootAbpVersion" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.*" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\\$ModuleName.Domain\\$ModuleName.Domain.csproj" />
  </ItemGroup>
</Project>
"@

Write-Utf8File (Join-Path $basePath "$ModuleName.HttpApi/$ModuleName.HttpApi.csproj") @"
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Volo.Abp.AspNetCore.Mvc" Version="$rootAbpVersion" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\\$ModuleName.Application.Contracts\\$ModuleName.Application.Contracts.csproj" />
  </ItemGroup>
</Project>
"@

# ===== minimal code (Entity, DTO, AppService, Controller, DbContextExtension, Module.cs) =====
Write-Utf8File (Join-Path $basePath "$ModuleName.Domain/Entities/${ModuleName}.cs") "public class ${ModuleName} : Volo.Abp.Domain.Entities.Auditing.FullAuditedAggregateRoot<System.Guid> { public string Title { get; protected set; } public string JsonDefinition { get; protected set; } protected ${ModuleName}(){} public ${ModuleName}(System.Guid id,string title,string json):base(id){ Title=title; JsonDefinition=json; } }"

Write-Utf8File (Join-Path $basePath "$ModuleName.Application.Contracts/Dtos/${ModuleName}Dtos.cs") "public class ${ModuleName}Dto: Volo.Abp.Application.Dtos.AuditedEntityDto<System.Guid>{ public string Title {get;set;} public string JsonDefinition{get;set;} } public class Create${ModuleName}Dto{ public string Title{get;set;} public string JsonDefinition{get;set;} }"

Write-Utf8File (Join-Path $basePath "$ModuleName.Application/${ModuleName}AppService.cs") "public class ${ModuleName}AppService: Volo.Abp.Application.Services.ApplicationService { private readonly Volo.Abp.Domain.Repositories.IRepository<${ModuleName},System.Guid> _repo; public ${ModuleName}AppService(Volo.Abp.Domain.Repositories.IRepository<${ModuleName},System.Guid> repo){_repo=repo;} public async System.Threading.Tasks.Task<${ModuleName}Dto> GetAsync(System.Guid id){ var e=await _repo.GetAsync(id); return ObjectMapper.Map<${ModuleName},${ModuleName}Dto>(e);} public async System.Threading.Tasks.Task<${ModuleName}Dto> CreateAsync(Create${ModuleName}Dto input){ var e=new ${ModuleName}(GuidGenerator.Create(),input.Title,input.JsonDefinition); await _repo.InsertAsync(e,true); return ObjectMapper.Map<${ModuleName},${ModuleName}Dto>(e);} }"

Write-Utf8File (Join-Path $basePath "$ModuleName.HttpApi/Controllers/${ModuleName}Controller.cs") "[Microsoft.AspNetCore.Mvc.Route(\"api/app/${ModuleName.ToLower()}s\")] public class ${ModuleName}Controller: Volo.Abp.AspNetCore.Mvc.AbpController { private readonly ${ModuleName}AppService _svc; public ${ModuleName}Controller(${ModuleName}AppService svc){_svc=svc;} [Microsoft.AspNetCore.Mvc.HttpGet(\"{id}\")] public System.Threading.Tasks.Task<${ModuleName}Dto> GetAsync(System.Guid id)=>_svc.GetAsync(id); [Microsoft.AspNetCore.Mvc.HttpPost] public System.Threading.Tasks.Task<${ModuleName}Dto> CreateAsync(Create${ModuleName}Dto input)=>_svc.CreateAsync(input);}"

Write-Utf8File (Join-Path $basePath "$ModuleName.EntityFrameworkCore/${ModuleName}DbContextModelCreatingExtensions.cs") "public static class ${ModuleName}DbContextModelCreatingExtensions { public static void Configure${ModuleName}(this Microsoft.EntityFrameworkCore.ModelBuilder builder){ builder.Entity<${ModuleName}>(b=>{ b.ToTable(\"${ModuleName}s\"); b.Property(x=>x.Title).IsRequired().HasMaxLength(128); }); } }"

# ===== Module.cs files =====
Write-Utf8File (Join-Path $basePath "$ModuleName.Domain.Shared/${ModuleName}DomainSharedModule.cs") "[DependsOn(typeof(Volo.Abp.Ddd.Domain.Shared.AbpDddDomainSharedModule))] public class ${ModuleName}DomainSharedModule: Volo.Abp.Modularity.AbpModule{}"
Write-Utf8File (Join-Path $basePath "$ModuleName.Domain/${ModuleName}DomainModule.cs") "[DependsOn(typeof(${ModuleName}DomainSharedModule))] public class ${ModuleName}DomainModule: Volo.Abp.Modularity.AbpModule{}"
Write-Utf8File (Join-Path $basePath "$ModuleName.Application.Contracts/${ModuleName}ApplicationContractsModule.cs") "[DependsOn(typeof(${ModuleName}DomainSharedModule))] public class ${ModuleName}ApplicationContractsModule: Volo.Abp.Modularity.AbpModule{}"
Write-Utf8File (Join-Path $basePath "$ModuleName.Application/${ModuleName}ApplicationModule.cs") "[DependsOn(typeof(${ModuleName}ApplicationContractsModule),typeof(${ModuleName}DomainModule))] public class ${ModuleName}ApplicationModule: Volo.Abp.Modularity.AbpModule{}"
Write-Utf8File (Join-Path $basePath "$ModuleName.EntityFrameworkCore/${ModuleName}EntityFrameworkCoreModule.cs") "[DependsOn(typeof(${ModuleName}DomainModule),typeof(Volo.Abp.EntityFrameworkCore.AbpEntityFrameworkCoreModule))] public class ${ModuleName}EntityFrameworkCoreModule: Volo.Abp.Modularity.AbpModule{}"
Write-Utf8File (Join-Path $basePath "$ModuleName.HttpApi/${ModuleName}HttpApiModule.cs") "[DependsOn(typeof(${ModuleName}ApplicationContractsModule),typeof(Volo.Abp.AspNetCore.Mvc.AbpAspNetCoreMvcModule))] public class ${ModuleName}HttpApiModule: Volo.Abp.Modularity.AbpModule{}"

# ===== Add DependsOn in HostModule =====
$hostModuleFile = Join-Path $HostProjectPath "RavinaFaradidHttpApiHostModule.cs"
if (Test-Path $hostModuleFile) {
    $content = Get-Content $hostModuleFile -Raw
    if ($content -notmatch "${ModuleName}ApplicationModule") {
        $injection = "typeof(${ModuleName}ApplicationModule), typeof(${ModuleName}EntityFrameworkCoreModule), typeof(${ModuleName}HttpApiModule)"
        $content = $content -replace "(\[DependsOn\(.*)", "`$1, $injection"
        Set-Content -Path $hostModuleFile -Value $content -Encoding UTF8
        Write-Host "✅ DependsOn for $ModuleName added to HostModule"
    }
}

# ===== Run EF Core Migration =====
Push-Location $HostProjectPath
try {
    dotnet ef migrations add "Added_$ModuleName" -p (Join-Path ..\\.. "$RootPath/$ModuleName/$ModuleName.EntityFrameworkCore") -s .
    dotnet ef database update -p (Join-Path ..\\.. "$RootPath/$ModuleName/$ModuleName.EntityFrameworkCore") -s .
    Write-Host "✅ Migration & DB update completed for $ModuleName"
} catch {
    Write-Host "⚠️ EF Core migration failed: $_"
}
Pop-Location

Write-Host "🎉 Full ABP module '$ModuleName' created and integrated with Host."
