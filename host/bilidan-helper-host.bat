@ECHO OFF
SET PATH=%~dp0bin;%~dp0mpv;%PATH%
python3 "%~dp0/bilidan-helper-host" %*
