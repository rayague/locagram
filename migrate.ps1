# Migration script: demarcheur-dashboard-hub -> locagram/client
$src = "D:\Projects\locagram\demarcheur-dashboard-hub\src"
$dst = "D:\Projects\locagram\client\src"

function CopyAndFix($srcFile, $dstFile) {
    $dir = Split-Path $dstFile -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $content = Get-Content $srcFile -Raw -Encoding UTF8
    # Fix toast import path
    $content = $content -replace "from '@/components/ui/use-toast'", "from '@/hooks/use-toast'"
    $content = $content -replace 'from "@/components/ui/use-toast"', 'from "@/hooks/use-toast"'
    # Fix react-router-dom Link: <Link to= -> <Link href=
    $content = $content -replace '<Link to=', '<Link href='
    Set-Content $dstFile $content -Encoding UTF8 -NoNewline
    Write-Host "Copied: $dstFile"
}

# Admin pages
$adminPages = @(
    "AdminDashboard", "AdminProfile", "AdminSettings",
    "CategoriesManagement", "ListingsManagement",
    "Notifications", "SubscriptionManagement", "UsersManagement"
)
foreach ($page in $adminPages) {
    CopyAndFix "$src\pages\admin\$page.tsx" "$dst\pages\admin\$page.tsx"
}

# Dashboard pages
$dashPages = @(
    "CreateListing", "Dashboard", "EditListing",
    "ListingDetail", "ListingDetails", "Listings",
    "Messages", "Profile", "Reservations", "Settings", "Statistics", "Subscription"
)
foreach ($page in $dashPages) {
    CopyAndFix "$src\pages\dashboard\$page.tsx" "$dst\pages\dashboard\$page.tsx"
}

# Auth pages
CopyAndFix "$src\pages\RegistrationPending.tsx" "$dst\pages\auth\RegistrationPending.tsx"
CopyAndFix "$src\pages\ForgotPassword.tsx"      "$dst\pages\auth\ForgotPassword.tsx"
CopyAndFix "$src\pages\ResetPassword.tsx"       "$dst\pages\auth\ResetPassword.tsx"

# Contexts
CopyAndFix "$src\contexts\NotificationContext.tsx" "$dst\contexts\NotificationContext.tsx"

# Admin components
CopyAndFix "$src\components\admin\NotificationCenter.tsx" "$dst\components\admin\NotificationCenter.tsx"

# UI components
CopyAndFix "$src\components\ui\notification.tsx" "$dst\components\ui\notification.tsx"

Write-Host "Migration complete!"
