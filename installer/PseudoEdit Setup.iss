; Script generated by the Inno Script Studio Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define MyAppName "PseudoEdit"
#define MyAppVersion "1.0.5"
#define MyAppPublisher "Carl Mutius"
#define MyAppURL "https://github.com/carl-vmt/PseudoEdit"
#define MyAppExeName "PseudoEdit.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{F14A2563-469E-478F-8875-2247E39A6153}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
OutputDir=C:\Users\mutiu\repos\PseudoEdit\installer\out
OutputBaseFilename=PseudoEdit-Setup
SetupIconFile=C:\Users\mutiu\repos\PseudoEdit\src\resources\icon.ico
UninstallDisplayIcon=C:\Users\mutiu\repos\PseudoEdit\src\resources\icon.ico
UninstallDisplayName=PseudoEdit V{#MyAppVersion}
Compression=lzma
SolidCompression=yes
WizardStyle=modern
ShowLanguageDialog=no
WizardResizable=True
ChangesAssociations=True

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 0,6.1

[Files]
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\PseudoEdit.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\chrome_100_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\chrome_200_percent.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\d3dcompiler_47.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\ffmpeg.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\icudtl.dat"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\libEGL.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\libGLESv2.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\resources.pak"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\snapshot_blob.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\v8_context_snapshot.bin"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\version"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\vk_swiftshader.dll"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\vk_swiftshader_icd.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\mutiu\repos\PseudoEdit\PseudoEdit-win32-x64\vulkan-1.dll"; DestDir: "{app}"; Flags: ignoreversion
; NOTE: Don't use "Flags: ignoreversion" on any shared system files
Source: "..\PseudoEdit-win32-x64\resources\*"; DestDir: "{app}\resources"; Flags: ignoreversion createallsubdirs recursesubdirs
Source: "C:\Windows\Fonts\Hack-Regular.ttf"; DestDir: "{fonts}"; FontInstall: "Hack Regular"; Flags: onlyifdoesntexist uninsneveruninstall
Source: "C:\Windows\Fonts\Hack-Bold.ttf"; DestDir: "{fonts}"; FontInstall: "Hack Bold"; Flags: onlyifdoesntexist uninsneveruninstall

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
