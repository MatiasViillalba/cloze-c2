<#
.SYNOPSIS
    Publishes the project to GitHub in one command.

.DESCRIPTION
    Builds the commit history if it is not there yet, points the repository at
    your GitHub remote and pushes everything in a single operation. Git sends
    the whole history in one transfer: there is no per-commit push.

    Before running this, create an EMPTY repository at https://github.com/new
    (no README, no .gitignore, no licence). If GitHub adds any file for you, the
    push will be rejected as non-fast-forward.

.PARAMETER RemoteUrl
    The HTTPS or SSH URL of the empty GitHub repository.

.PARAMETER Branch
    Branch to publish. Defaults to main.

.PARAMETER Name
    Author name used if the history still has to be built.

.PARAMETER Email
    Author email. Must be a verified email on your GitHub account for the
    commits to show up on your contribution graph.

.PARAMETER Force
    Overwrite whatever is on the remote branch. Only use this if you know the
    remote history is disposable.

.EXAMPLE
    .\scripts\publish.ps1 -RemoteUrl https://github.com/MatiasViillalba/cloze-c2.git
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $RemoteUrl,

    [string] $Branch = 'main',
    [string] $Name   = 'MatiasViillalba',
    [string] $Email  = 'mativillalbba@gmail.com',
    [switch] $Force
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot  = Split-Path -Parent $scriptDir
Push-Location $repoRoot

# Windows PowerShell turns a native command's stderr into a terminating error
# while $ErrorActionPreference is 'Stop', so probes that may legitimately fail
# have to run with it relaxed.
function Test-GitSucceeds {
    param([string[]] $Arguments)
    $previous = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & git @Arguments 2>&1 | Out-Null
        return ($LASTEXITCODE -eq 0)
    } finally {
        $ErrorActionPreference = $previous
    }
}

try {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw 'git is not installed or not on PATH. Install it from https://git-scm.com/download/win and try again.'
    }

    # --- 1. History --------------------------------------------------------
    if (-not (Test-GitSucceeds @('rev-parse', '--verify', 'HEAD'))) {
        Write-Host 'No commits yet - building the project history first.' -ForegroundColor Cyan
        & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'seed-history.ps1') `
            -Name $Name -Email $Email -Branch $Branch
        if ($LASTEXITCODE -ne 0) { throw 'Failed to build the commit history.' }
    }

    $commitCount = (& git rev-list --count HEAD).Trim()
    Write-Host ''
    Write-Host ("Repository has {0} commits ready to publish." -f $commitCount) -ForegroundColor Green

    # --- 2. Branch ---------------------------------------------------------
    $currentBranch = (& git rev-parse --abbrev-ref HEAD).Trim()
    if ($currentBranch -ne $Branch) {
        & git branch -M $Branch
    }

    # --- 3. Remote ---------------------------------------------------------
    if (Test-GitSucceeds @('remote', 'get-url', 'origin')) {
        & git remote set-url origin $RemoteUrl
        Write-Host "Remote 'origin' updated to $RemoteUrl"
    } else {
        & git remote add origin $RemoteUrl
        Write-Host "Remote 'origin' set to $RemoteUrl"
    }

    # --- 4. Push everything at once ----------------------------------------
    Write-Host ''
    Write-Host ("Pushing all {0} commits in one go..." -f $commitCount) -ForegroundColor Cyan
    Write-Host 'If this is your first push, a browser window will open to sign in to GitHub.'
    Write-Host ''

    if ($Force) {
        & git push --force -u origin $Branch
    } else {
        & git push -u origin $Branch
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host ''
        Write-Host 'The push was rejected.' -ForegroundColor Yellow
        Write-Host 'The usual cause is that the GitHub repository is not empty (it was'
        Write-Host 'created with a README or a licence). Either delete and recreate it'
        Write-Host 'empty, or re-run this command with -Force to overwrite the remote.'
        exit 1
    }

    Test-GitSucceeds @('push', 'origin', '--tags') | Out-Null

    # --- 5. What to do next ------------------------------------------------
    $webUrl = $RemoteUrl -replace '\.git$', ''
    Write-Host ''
    Write-Host 'Published.' -ForegroundColor Green
    Write-Host ''
    Write-Host 'Next, turn on GitHub Pages so you can install the app on your iPhone:' -ForegroundColor Cyan
    Write-Host "  1. Open  $webUrl/settings/pages"
    Write-Host '  2. Source: "Deploy from a branch"'
    Write-Host ("  3. Branch: {0}, folder: / (root), then Save" -f $Branch)
    Write-Host '  4. Wait about a minute, then open the URL Pages gives you IN SAFARI'
    Write-Host '  5. Share button -> Add to Home Screen'
    Write-Host ''
}
finally {
    Pop-Location
}
