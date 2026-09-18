$files = @(
    "c:/Users/risha/Downloads/MikroMedia-main/MikroMedia-main/about-us.html",
    "c:/Users/risha/Downloads/MikroMedia-main/MikroMedia-main/services.html",
    "c:/Users/risha/Downloads/MikroMedia-main/MikroMedia-main/web-mobile-development.html",
    "c:/Users/risha/Downloads/MikroMedia-main/MikroMedia-main/digital-marketing.html",
    "c:/Users/risha/Downloads/MikroMedia-main/MikroMedia-main/branding-creative-design.html",
    "c:/Users/risha/Downloads/MikroMedia-main/MikroMedia-main/business-automation.html"
)

$pattern = '(?s)<div class="tp-footer-widget-social">\s*<a href="#">.*?</div>'
$replacement = '<div class="tp-footer-widget-social">
                  <a href="https://www.linkedin.com/company/mikromedia01/?viewAsMember=true" target="_blank">
                    <span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </span>
                  </a>
                  <a href="https://www.instagram.com/mikromedia.in/?hl=en" target="_blank">
                    <span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </span>
                  </a>
                  <a href="https://www.facebook.com/people/MikroMedia/61578098201457/" target="_blank">
                    <span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </span>
                  </a>
                </div>'

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content -Raw $file
        if ($content -match $pattern) {
            Write-Host "Updating $file"
            $newContent = $content -replace $pattern, $replacement
            $newContent | Set-Content -Path $file -NoNewline
        }
        else {
            Write-Host "Pattern not found in $file"
        }
    }
    else {
        Write-Host "File not found: $file"
    }
}
