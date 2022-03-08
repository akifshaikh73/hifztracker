param(
    [Parameter()]
    [string]$env="dev"
)
if($env -eq 'dev') {
    $profile = "cli"
    $s3bucket = "hifztracker"
}

if($env -eq 'prod') {
    $profile = "usem-admin"
    $s3bucket = "hifztrackerp"
}

aws --profile $profile s3 ls 
#Get-ChildItem -Path .\dist -Recurse

#Get-ChildItem | ForEach-Object { $_ }

$s3url  = "s3://"+$s3bucket
#npm run build
aws --profile $profile s3  sync  dist $s3url --delete --acl public-read 
#Write-Output("$out")