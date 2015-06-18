@ECHO OFF
SET PATH=%~dp0bin;%~dp0mpv;%PATH%
CD %~dp0
python "%~dp0/bilidan-helper-host" %*