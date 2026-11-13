# CityCom: compile le navigateur, ajoute le pack de langue francais et le lance.
#
#   .\citycom.ps1                 build rapide (dev) puis lancement
#   .\citycom.ps1 -Faster         recompile seulement l'interface (JS/CSS/prefs), quelques secondes
#   .\citycom.ps1 -Release        build final optimise (plusieurs heures)
#   .\citycom.ps1 -NoRun          ne lance pas le navigateur a la fin
param(
    [switch]$Release,
    [switch]$Faster,
    [switch]$NoRun
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$python = "C:\mozilla-build\python3\python.exe"
if (-not (Test-Path $python)) {
    throw "MozillaBuild introuvable dans C:\mozilla-build"
}

$flavor = if ($Release) { "release" } else { "dev" }
$env:MOZCONFIG = Join-Path $PSScriptRoot "mozconfig-citycom-$flavor"
$objdir = Join-Path $PSScriptRoot "obj-citycom-$flavor"

function Invoke-Mach {
    & $python .\mach @args
    if ($LASTEXITCODE -ne 0) {
        throw "mach $args a echoue (code $LASTEXITCODE)"
    }
}

$l10n = Join-Path $env:USERPROFILE ".mozbuild\l10n-central"
if (-not (Test-Path (Join-Path $l10n "fr"))) {
    git clone --depth 1 --filter=blob:none --sparse https://github.com/mozilla-l10n/firefox-l10n $l10n
    git -C $l10n sparse-checkout set fr
} else {
    git -C $l10n pull --ff-only
}

if ($Faster) {
    Invoke-Mach build faster
} else {
    Invoke-Mach build
}

Invoke-Mach build langpack-fr
$langpack = Get-ChildItem (Join-Path $objdir "dist\*\xpi\*.fr.langpack.xpi") |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
$extensions = Join-Path $objdir "dist\bin\distribution\extensions"
New-Item -ItemType Directory -Force $extensions | Out-Null
Copy-Item $langpack.FullName (Join-Path $extensions "langpack-fr@firefox.mozilla.org.xpi") -Force

if (-not $NoRun) {
    Invoke-Mach run
}
