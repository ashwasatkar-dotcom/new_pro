@echo off
:: Enable TCP/IP on port 1433 for Microsoft SQL Server Express
echo ========================================================
echo  Configuring Microsoft SQL Server Express for HostelHub
echo ========================================================
echo.

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script must be run as Administrator!
    echo Please right-click this file and select "Run as administrator".
    echo.
    pause
    exit /b 1
)

echo [1/3] Enabling TCP/IP protocol in registry...
powershell -Command "Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp' -Name 'Enabled' -Value 1 -Force"
powershell -Command "Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp\IPAll' -Name 'TcpPort' -Value '1433' -Force"
powershell -Command "Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQLServer\SuperSocketNetLib\Tcp\IPAll' -Name 'TcpDynamicPorts' -Value '' -Force"

echo [2/3] Enabling and starting SQL Server Browser...
sc config SQLBrowser start= auto >nul 2>&1
net start SQLBrowser >nul 2>&1

echo [3/3] Restarting SQL Server (SQLEXPRESS)...
net stop "MSSQL$SQLEXPRESS" >nul 2>&1
net start "MSSQL$SQLEXPRESS" >nul 2>&1

echo.
echo ========================================================
echo [SUCCESS] SQL Server TCP/IP is now ENABLED on port 1433!
echo ========================================================
echo.
echo Next Steps:
echo 1. Ensure the database 'hostelhub_db' exists in your SQL Server.
echo 2. Verify your 'sa' password in backend/src/main/resources/application-mssql.properties
echo 3. Click Run in IntelliJ IDEA!
echo.
pause
