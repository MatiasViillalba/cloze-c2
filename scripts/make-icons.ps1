<#
.SYNOPSIS
    Generates the PNG icon set for the PWA.

.DESCRIPTION
    iOS will not use an SVG for a home-screen icon and handles transparency
    poorly, so every icon here is a fully opaque PNG painted with System.Drawing:
    a near-black field, a radial ember glow and the "C2" wordmark.

    Sizes produced:
      icons/icon-192.png         Android / manifest
      icons/icon-512.png         Android / manifest, splash generation
      icons/maskable-512.png     Android adaptive icon (extra safe-area padding)
      icons/apple-touch-icon.png 180x180, the one iOS actually reads

.EXAMPLE
    pwsh -File scripts/make-icons.ps1
#>

[CmdletBinding()]
param(
    [string] $OutDir
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($OutDir)) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
    $OutDir = Join-Path $scriptDir '../icons'
}

Add-Type -AssemblyName System.Drawing

$OutDir = [System.IO.Path]::GetFullPath($OutDir)
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir -Force | Out-Null }

function New-Icon {
    param(
        [int]    $Size,
        [string] $Path,
        [double] $Inset = 0.0   # fraction of the canvas kept clear (maskable safe area)
    )

    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # --- Opaque near-black field -------------------------------------------
    $bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 8, 8, 11))
    $g.FillRectangle($bg, 0, 0, $Size, $Size)
    $bg.Dispose()

    # --- Ember glow, top-left ----------------------------------------------
    $pad   = [int]($Size * $Inset)
    $inner = $Size - (2 * $pad)

    $glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $glowRect = New-Object System.Drawing.Rectangle(
        [int]($pad - $inner * 0.22), [int]($pad - $inner * 0.28),
        [int]($inner * 1.15), [int]($inner * 1.15))
    $glowPath.AddEllipse($glowRect)

    $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
    $glow.CenterColor    = [System.Drawing.Color]::FromArgb(120, 255, 122, 24)
    $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 238, 74, 0))
    $g.FillRectangle($glow, 0, 0, $Size, $Size)
    $glow.Dispose()
    $glowPath.Dispose()

    # --- Ember lozenge behind the wordmark ---------------------------------
    $lozRect = New-Object System.Drawing.RectangleF(
        [single]($pad + $inner * 0.14), [single]($pad + $inner * 0.14),
        [single]($inner * 0.72), [single]($inner * 0.72))
    $loz = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $lozRect,
        [System.Drawing.Color]::FromArgb(255, 255, 154, 61),
        [System.Drawing.Color]::FromArgb(255, 238, 74, 0),
        45.0)
    $radius = [single]($inner * 0.20)
    $rounded = New-Object System.Drawing.Drawing2D.GraphicsPath
    $rounded.AddArc($lozRect.X, $lozRect.Y, $radius * 2, $radius * 2, 180, 90)
    $rounded.AddArc($lozRect.Right - $radius * 2, $lozRect.Y, $radius * 2, $radius * 2, 270, 90)
    $rounded.AddArc($lozRect.Right - $radius * 2, $lozRect.Bottom - $radius * 2, $radius * 2, $radius * 2, 0, 90)
    $rounded.AddArc($lozRect.X, $lozRect.Bottom - $radius * 2, $radius * 2, $radius * 2, 90, 90)
    $rounded.CloseFigure()
    $g.FillPath($loz, $rounded)
    $loz.Dispose()

    # --- Wordmark -----------------------------------------------------------
    $fontSize = [single]($inner * 0.30)
    $family = $null
    foreach ($candidate in @('Segoe UI Black', 'Segoe UI', 'Arial Black', 'Arial')) {
        try { $family = New-Object System.Drawing.FontFamily($candidate); break } catch { }
    }
    if ($null -eq $family) { $family = [System.Drawing.FontFamily]::GenericSansSerif }

    $font = New-Object System.Drawing.Font($family, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fmt  = New-Object System.Drawing.StringFormat
    $fmt.Alignment     = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center

    $ink = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 26, 8, 0))
    $g.DrawString('C2', $font, $ink, $lozRect, $fmt)

    $ink.Dispose(); $font.Dispose(); $fmt.Dispose(); $rounded.Dispose()

    $g.Dispose()
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    Write-Host ("  {0,-26} {1}x{1}" -f (Split-Path $Path -Leaf), $Size)
}

Write-Host 'Generating icon set...'
New-Icon -Size 192 -Path (Join-Path $OutDir 'icon-192.png')          -Inset 0.06
New-Icon -Size 512 -Path (Join-Path $OutDir 'icon-512.png')          -Inset 0.06
New-Icon -Size 512 -Path (Join-Path $OutDir 'maskable-512.png')      -Inset 0.16
New-Icon -Size 180 -Path (Join-Path $OutDir 'apple-touch-icon.png')  -Inset 0.04
Write-Host 'Done.'
