##替換的版本號  $args[0] = bat傳入的參數
##(powershell -File test.ps1 "123")  -> $args[0]=123
$global:versionNo = '?csSvnVersion='+$args[0]

##掃描的資料夾路徑 $args[1] = bat傳入的參數第二參數
##$global:folder = 'C:\apache-tomcat-6.0.3-x64-1\webapps\xindian'
$global:folder = $args[1]

##要替換的內容
$global:pattern = "\?csSvnVersion=\d*"
##掃描總檔案數量
$global:fileCountArr = @(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
##累計替換檔案數量
$global:replaceCountArr = @(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

$global:count = -1

##搜尋檔案內是否有 字串 ?csSvnVersion=\d* 並替換之
function changeVersionString{
	param($files)
	$global:count += 1
	$global:fileCountArr[$count] = $files.length
	$global:replaceCountArr[$count] = 0
	foreach($file in $files) {
		$SEL = Select-String -Path $file.FullName -Pattern $global:pattern
		if ( $SEL ){
			$global:replaceCountArr[$count] += 1
			Write-Output "Change : $($file.FullName)"
			(gc $file.FullName -encoding UTF8) -replace $global:pattern, $global:versionNo | Out-File -encoding UTF8 $file.FullName
		}else{
			##Write-Output "No Change : $($file.FullName)"
		}
	}
}

$files = @(Get-ChildItem -Path $global:folder *.html -Recurse)
changeVersionString -files $files
$files = @(Get-ChildItem -Path $global:folder *.jsp -Recurs)
changeVersionString -files $files
##$files = @(Get-ChildItem *.js -Recurs)
##changeVersionString -files $files

Write-Output "---------------"
Write-Output "scan *.html files = $($global:fileCountArr[0])"
Write-Output "replace *.html files = $($global:replaceCountArr[0])"
Write-Output ""
Write-Output "scan *.jsp files = $($global:fileCountArr[1])"
Write-Output "replace *.jsp files = $($global:replaceCountArr[1])"
##echo ""
##echo "scan *.js files = $($global:fileCountArr[2])"
##echo "replace *.js files = $($global:replaceCountArr[2])"