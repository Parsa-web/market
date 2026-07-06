#!powershell
# Extract class names from global.css
$content = Get-Content "src/styles/global.css" -Raw -Encoding UTF8

# Use regex to capture all CSS class definitions
$classPattern = "\.([a-zA-Z_\\-\\.]+)\\s*(?::{1,2}\\s*)?\\s*\{"
$classNames = [System.Collections.Generic.HashSet[string]]::New()

$matches = [regex]::Matches($content, $classPattern)
foreach ($match in $matches) {
    $classNames.Add($match.Groups[1].Value) > $null
}

Write-Host "Found $($classNames.Count) unique class names"

# Convert to sorted array
$classArray = $classNames | Sort-Object

# Categories based on examination of the CSS
$layout = @(
    "container", "header", "header--scrolled", "header-inner", "header-logo",
    "logo-mark", "logo-mark-light", "logo-text", "header-nav", "header-nav-more-btn",
    "header-dropdown-layer", "header-dropdown-inner", "header-user-menu-info",
    "header-user-menu-avatar", "header-user-menu-name", "header-user-menu-role",
    "header-chevron", "header-actions", "header-auth-buttons", "header-mobile-buttons",
    "header-user", "header-user-badge", "header-user-name", "header-notif",
    "header-bell", "header-bell-badge", "header-bell-badge--count", "header-notif-panel",
    "header-notif-header", "header-notif-close", "header-notif-body", "header-notif-empty",
    "header-notif-footer", "header-dropdown-item", "header-dropdown-item--danger",
    "header-dropdown-divider", "header-dashboard-btn", "header-nav-profile",
    "header-overlay", "menu-toggle"
)

$buttons = @(
    "btn", "btn-primary", "btn-primary:hover", "btn-ghost", "btn-ghost:hover",
    "btn-outline", "btn-outline:hover", "btn-sm", "btn-lg", "btn-full", "btn-white",
    "btn-white:hover"
)

$forms = @(
    "auth-page", "auth-split", "auth-illustration", "auth-illustration-inner",
    "auth-illustration-svg", "auth-illustration-caption", "auth-panel",
    "auth-register-content", "auth-register-content--form", "auth-register-top",
    "auth-back-link", "auth-back-link:hover", "auth-card", "auth-card--wide",
    "auth-brand", "auth-brand-mark", "auth-brand-name", "auth-title", "auth-subtitle",
    "auth-field", "auth-field-label", "auth-label", "auth-input-wrapper", "auth-input-icon",
    "auth-input", "auth-input::placeholder", "auth-input.has-error",
    "auth-input-wrapper:focus-within .auth-input-icon", "auth-error-text", "form-grid",
    "form-grid > *", "form-field", "form-label", "form-icon", "form-input",
    "form-input::placeholder", "auth-password-toggle", "auth-password-toggle:hover",
    "auth-btn", "auth-btn-primary", "auth-btn-primary:hover", "auth-btn-primary:active",
    "auth-btn-primary:disabled", "auth-submit", "auth-btn-loader", "auth-spinner",
    "auth-links", "auth-link-text", "auth-link", "auth-link:hover", "auth-forgot",
    "auth-forgot:hover", "auth-notice", "auth-divider"
)

$cards = @(
    "hero", "hero-layout", "hero-text", "hero-visual", "hero-image", "hero-title",
    "hero-subtitle", "search-wrapper", "search-bar", "search-bar.focused", "search-icon",
    "search-input", "search-input::placeholder", "search-btn", "search-btn:hover",
    "search-suggestions", "suggestion-item", "suggestion-item:not(:last-child)",
    "suggestion-item:hover", "suggestion-item svg", "popular-searches", "popular-label",
    "tag-btn", "tag-btn:hover", "trust-strip", "trust-stat", "trust-stat svg",
    "section", "section-alt", "section-header", "section-title", "section-desc",
    "categories-grid", "category-card", "category-icon", "category-card:hover .category-icon",
    "category-info", "category-title", "category-desc", "category-count", "category-arrow",
    "steps", "step", "step-number", "step-icon", "step-title", "step-desc", "step-arrow",
    "specialists-grid", "specialist-card", "specialist-top", "verified-badge",
    "specialist-avatar", "specialist-name", "specialist-role", "specialist-rating",
    "specialist-rating .star", "specialist-rating .star.filled", "rating-value",
    "specialist-skills", "skill-badge", "specialist-experience", "specialist-experience svg"
)

$tags = @(
    "requests-grid", "request-card", "request-card:hover", "request-top", "request-title",
    "request-badge", "request-badge.urgent", "request-badge.pending", "request-details",
    "request-detail", "detail-label", "detail-value", "detail-value.brand",
    "request-skills", "skills-label"
)

$trust = @(
    "trust-grid", "trust-card", "trust-card:hover", "trust-icon",
    "trust-card:hover .trust-icon", "trust-title", "trust-desc"
)

$cta = @(
    "cta-section", "cta-section::before", "cta-title", "cta-subtitle", "cta-buttons",
    "cta-section .btn-primary", "cta-section .btn-primary:hover"
)

$footer = @(
    "footer", "footer-grid", "footer-brand", "footer-logo", "footer-desc",
    "footer-contact", "footer-contact-item", "footer-contact-item svg", "footer-heading",
    "footer-links li", "footer-links a", "footer-links a:hover", "social-links",
    "social-link", "social-link:hover", "footer-bottom"
)

$rg = @(
    "rg-intro", "rg-intro--exit", "rg-step-badge", "rg-role-stage", "rg-role-stage--exit",
    "rg-form-panel", "rg-form-section-hint", "rg-panel", "rg-header", "rg-brand",
    "rg-brand-mark", "rg-brand-name", "rg-back-btn", "rg-back-btn:hover", "rg-body",
    "rg-content", "rg-title", "rg-subtitle", "rg-role-grid", "rg-role-card",
    "rg-role-card:hover", "rg-role-card:focus-visible", "rg-role-card:disabled",
    "rg-role-card.selected", "rg-role-check", "rg-role-card.selected .rg-role-check",
    "rg-role-icon", "rg-role-card.selected .rg-role-icon", "rg-role-card.selected .rg-role-icon svg",
    "rg-role-name", "rg-role-desc", "rg-step", "rg-step--form", "rg-form-header",
    "rg-form-back", "rg-form-back:hover", "rg-form-title", "rg-form-subtitle",
    "rg-form-grid", "rg-form-grid .rg-full", "rg-form-section", "rg-form-section-title",
    "rg-required", "rg-success", "rg-success-icon", "rg-success-icon svg",
    "rg-success-title", "rg-success-text"
)

$dash = @(
    "dash-layout", "dash-sidebar", "dash-sidebar-top", "dash-sidebar-brand-row",
    "dash-sidebar-close", "dash-sidebar-company", "dash-sidebar-company-icon",
    "dash-sidebar-company-name", "dash-sidebar-role", "dash-sidebar-nav",
    "dash-sidebar-link", "dash-sidebar-link--active", "dash-sidebar-badge",
    "dash-sidebar-bottom", "dash-sidebar-home", "dash-sidebar-logout", "dash-sidebar-overlay",
    "dash-main", "dash-header", "dash-header-start", "dash-header-menu",
    "dash-header-title", "dash-header-center", "dash-header-end", "dash-search",
    "dash-search-icon", "dash-search-input", "dash-header-notif-wrap", "dash-header-notif",
    "dash-header-notif-badge", "dash-header-profile", "dash-header-profile-btn",
    "dash-header-chevron", "dash-header-chevron.open", "dash-header-dropdown-info",
    "dash-header-dropdown-name", "dash-header-dropdown-role", "dash-header-dropdown-item",
    "dash-header-dropdown-item--danger", "dash-dropdown-overlay", "dash-dropdown-portal",
    "dash-header-dropdown", "dash-notif-panel", "dash-notif-panel-header",
    "dash-notif-panel-count", "dash-notif-panel-close", "dash-notif-panel-body",
    "dash-notif-panel-empty", "dash-notif-item", "dash-notif-item-top", "dash-notif-item-name",
    "dash-notif-item-time", "dash-notif-item-text", "dash-notif-panel-footer",
    "dash-content", "dash-page", "dash-page--flush", "dash-welcome", "dash-welcome-title",
    "dash-welcome-subtitle", "dash-welcome-actions", "dash-stats-grid", "dash-stat-card",
    "dash-stat-icon", "dash-stat-content", "dash-stat-value", "dash-stat-label",
    "dash-stat-desc", "dash-stat-arrow", "dash-section", "dash-section-header",
    "dash-section-title", "dash-section-link", "dash-page-desc", "dash-page-toolbar",
    "dash-badge", "dash-badge--active", "dash-badge--pending", "dash-badge--completed",
    "dash-badge--closed", "dash-badge--urgent", "dash-badge--skill", "dash-badge--machine",
    "dash-badge--brand", "dash-badge--default", "dash-avatar", "dash-avatar--sm",
    "dash-avatar--md", "dash-avatar--lg", "dash-avatar--xl", "dash-requests-list",
    "dash-request-card", "dash-request-card--link", "dash-request-card-top",
    "dash-request-card-title", "dash-request-card-details", "dash-request-detail",
    "dash-request-detail-label", "dash-request-card-footer", "dash-request-date",
    "dash-request-actions", "dash-specialists-grid", "dash-specialist-card",
    "dash-specialist-card-header", "dash-specialist-avatar-wrap", "dash-specialist-verified",
    "dash-specialist-name", "dash-specialist-role", "dash-specialist-meta", "dash-dot",
    "dash-specialist-section", "dash-specialist-section-label", "dash-specialist-tags",
    "dash-specialist-verified-badge", "dash-specialist-actions", "dash-btn-sm",
    "dash-btn-danger", "dash-btn-danger-bg", "dash-filter-panel", "dash-filter-field",
    "dash-filter-label", "dash-select", "dash-select", "dash-filter-input", "dash-field-hint",
    "dash-filter-reset", "dash-form-card", "dash-form-title", "dash-form-subtitle",
    "dash-form", "dash-form-grid", "dash-form-actions", "dash-textarea",
    "dash-textarea.has-error", "dash-upload-section", "dash-upload-grid", "dash-upload-box",
    "dash-messages-layout", "dash-messages-sidebar", "dash-messages-sidebar-header",
    "dash-messages-unread-total", "dash-messages-list", "dash-message-card",
    "dash-message-card--active", "dash-message-card-content", "dash-message-card-top",
    "dash-message-card-name", "dash-message-card-time", "dash-message-card-preview",
    "dash-message-unread", "dash-chat", "dash-chat-header", "dash-chat-messages",
    "dash-chat-bubble", "dash-chat-bubble--sent", "dash-chat-bubble--unread",
    "dash-chat-time", "dash-chat-input", "dash-chat-send", "dash-chat-send",
    "dash-chat-empty", "dash-profile-card", "dash-profile-header", "dash-profile-header-info",
    "dash-profile-meta", "dash-profile-section", "dash-profile-section-header",
    "dash-profile-section-icon", "dash-profile-section-icon--primary",
    "dash-profile-section-icon--teal", "dash-profile-edit-divider", "dash-profile-edit-section",
    "dash-settings-grid", "dash-settings-card", "dash-settings-card--danger",
    "dash-settings-title", "dash-settings-desc", "dash-toggle-list", "dash-toggle-item"
)

# Write all class names to a file for parsing
$allClasses = $layout + $buttons + $forms + $cards + $tags + $trust + $cta + $footer + $rg + $dash
$allClasses | Sort-Object -Unique | Out-File -FilePath "class-names.txt" -Encoding UTF8

Write-Host "Exported all class names to class-names.txt"
Write-Host "Total: $($allClasses | Sort-Object -Unique).Count classes"

# Now parse and categorize them
$uniqueClasses = $allClasses | Sort-Object -Unique

Write-Host "=== LAYOUT SYSTEM ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(container|header|nav|section|footer|layout|hero|grid|auth|page|split|illustration|panel|card|brand|overlay|menu|toggle)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== UI COMPONENTS - BUTTONS ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(btn|button)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== UI COMPONENTS - FORMS AND INPUTS ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(auth|rg|dash|form|input|field|label|wrapper|icon|password|toggle|select|textarea)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== UI COMPONENTS - CARDS AND CONTAINERS ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(card|content|box|section|widget|panel|item|row|col|specialist|request|trust|step|avatar|bubble|chat|message)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== UI COMPONENTS - BADGES AND INDICATORS ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(badge|tag|indicator|dot|verified|rating|star|stat)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== UI COMPONENTS - TABLES AND LISTS ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(table|list|item|row|col|grid|specialist|request|trust|step|avatar|bubble|chat|message)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== UI COMPONENTS - MODALS AND OVERLAYS ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(modal|overlay|portal|layer|dropdown|panel|drawer|sheet|slide)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== PAGES ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(rg|factory|specialist|workspace)\b") {
        Write-Host "  $cls"
    }
}

Write-Host "\n=== UTILITIES ==="
foreach ($cls in $uniqueClasses) {
    if ($cls -match "^(text|margin|padding|color|bg|border|shadow|radius|font|spacing|z-index|overflow|display|flex|grid|align|justify|position|transition|animation|hover|active|focus|disabled|selected|open|close|hidden|visible|rtl|ltr|flex-|grid-|item-|row-|col-|container-|section-|hero-|cta-|trust-|step-|specialist-|request)\b") {
        Write-Host "  $cls"
    }
}
