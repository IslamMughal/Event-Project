Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('e:\Event Project\Prototype.docx')
$entry = $zip.GetEntry('word/document.xml')
$reader = New-Object System.IO.StreamReader($entry.Open())
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

$text = $xml -replace '<[^>]+>', ' ' -replace '\s+', ' '
Write-Host $text
