echo "date time" %date% %time%
powershell -File _changeJsCssVersionNo.ps1 %date:~0,4%%date:~5,2%%date:~8,2%%time:~0,2%%time:~3,2%%time:~6,2% "C:\Users\CS\Desktop\ด๚ธี"
pause