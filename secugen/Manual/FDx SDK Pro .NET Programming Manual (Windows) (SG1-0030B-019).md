# SecuGen

# .NET Programming Manual for FDx SDK Pro for Windows

For applications using SecuGen@ fingerprint readers

SG1-0030B-019 (Last updated: 5/30/2024)

Copyright @ 1998-2024 SecuGen Corporation. ALL RIGHTS RESERVED.Information in this document is subject to change without notice.The software described in this document is furnished under a license agreement or nondisclosure agreement.The software may be used only in accordance with the terms ofthe agreement.SecuGen, Auto-On,FDU02,FDU03,FDU04,SDU03,SDU04,U10, U20,U30,UPx,U-AIR and U20-ASF-BT are trademarks or registered trademarks ofSecuGen Corporation.Allother brands or product names may be trademarks,service marks or registered trademarks of their respective owners.

# Contents

# CHAPTER 1. OVERVIEW..

1.1.SYSTEM REQUIREMENTS .3   
1.2. ASSEMBLIES.. ...3   
1.3.NAMESPACES   
1.4.RUNTIME FILES

# CHAPTER 2. PROGRAMMING .

2.1.CREATING SGFINGERPRINTMANAGER OBJECT. .5  
2.2.INITIALIZING SGFINGERPRINTMANAGER OBJECT. .5   
2.3.OPENING THE SECUGEN FINGERPRINT READER   
2.4.GETTING DEVICE INFORMATION. .8   
2.5.CAPTURING A FINGERPRINT IMAGE .9   
2.6.GETTING IMAGE QUALITY. .11   
2.7.CONTROLLING BRIGHTNESS .11  
2.8.CREATING A TEMPLATE .12  
2.9.MATCHING TEMPLATES.. .13  
2.10. REGISTRATION PROCESS. .15   
2.11.VERIFICATIONPROCESS. .16   
2.12. GETTING MATCHING SCORE .17  
2.13. USING AUTO-ON TM. .18   
2.14.TEMPLATE FORMAT. .19   
2.15. MANIPULATING ANSI378, ISO19794-2, AND ISO19794-2 COMPACT TEMPLATES.. ..21   
2.16.GETTING VERSION INFORMATION OF MINEX CERTIFIED ALGORITHM .23

# CHAPTER3. SECUGEN.FDXSDKPRO.WINDOWS REFERENCE.. ..24

3.1.SGFINGERPRINTMANAGER CLASS. .24   
3.2.SGFPMDEVICEINFOPARAM STRUCTURE .43   
3.3.SGFPMDEVICEINFO STRUCTURE .44   
3.4.SGFPMDEVICELIST STRUCTURE .44   
3.5.SGFPMFINGERINFO STRUCTURE .45   
3.6.SGFPMANSITEMPLATEINFO STRUCTURE .46   
3.7.SGFPMDEVICENAME ENUMERATION .46   
3.8.SGFPMPORTADDR ENUMERATION ..46   
3.9.SGFPMSECURITYLEVEL ENUMERATION .47   
3.10.SGFPMTEMPLATEFORMAT ENUMERATION. .47   
3.11.SGFPMERROR ENUMERATION .47   
3.12.SGFPMAUTOONEVENT ENUMERATION. .48   
3.13.SGFPMMESSAGES ENUMERATION. .48   
3.14.SGFPMIMPRESSIONTYPE ENUMERATION .48   
3.15.SGFPMFINGERPOSITION ENUMERATION .49

# Chapter 1. Overview

FDx SDK Pro provides.NET assemblies for.NET developers to use SecuGen technology in.NETand .NET framework:

·SecuGen.FDxSDKPro.DotNet.Windows.dllfor.NET 6 or higher   
SecuGen.FDxSDKPro.Windows.dIl for .NET Framework

Programming with SecuGen's .NET library is easy.The inclusion offingerprint reader control, extraction, and matching algorithms in the SDK allows programmers to build biometric applications quickly and easily. Allfingerprint functions provided by the SDK are called through SecuGen.FDxSDKPro.Windows.dll or SecuGen.FDxSDKPro.DotNet.Windows.dlland are accessed through the SGFingerPrintManager class.

# 1.1. System Requirements1

# Developer's Environment (Windows)

Windows 11,10,8.1,8,7 SP1/Vista SP2/XP, Windows Server 2019 /2016 /2012/2008 R2 SP1   
.NET Framework SDK 4.0 or above   
.NET6 or higher   
Visual Studio 2015 or higher recommended (Visual Studio 2022 for .NET 6 or higher)

# Run-time Environment (Windows)

Windows 11, 10, 8.1,8,7 SP1/ Vista SP2 / XP   
Windows Server 2022, 2019 /2016 /2012/2008 R2 SP1   
.NET Framework 4.0 or above   
.NET 6 or higher   
. Visual studio 2015 runtimes

SecuGen USB readers capture and digitize fingerprint images. The host system then retrieves the image through its USB port for subsequent processing. All SecuGen USB readers, except for those based on FDU01 sensors,are supported in this SDK.

SecuGen Bluetooth Fingerprint Readers capture and digitize fingerprint images. While the host system is capable of retrieving the image wirelessly for subsequent processing,it is recommended to process the image within the Bluetooth device before transmiting to the host.This is because a fingerprint image has a larger data size compared to a fingerprint template. All SecuGen Bluetooth readers are supported in this SDK.

# 1.2. Assemblies

.NET: SecuGen.FDxSDKPro.DotNet.Windows.dll

.NET Framework: SecuGen.FDxSDKPro.Windows.dll

# 1.3. Namespaces

This namespace contains the SecuGen Fingerprint Management class.

SecuGen.FDxSDKPro.Windows

# 1.4. Runtime files

![](images/659b7a4d6fb55f1f183245593d112d03faaa7555bec29be1287378c22f4d3db1.jpg)

The SecuGen .NET Library² calls sgfplib.dll.To distribute or execute a .NET application using the SecuGen .NET Library, the following files are required.

sqfplib.dll Main module   
·sgfpamx.dll Fingerprint algorithm module for extraction & matching (MINEX Certified)   
sgwsqlib.dll WSQ module   
·sgfdusda.dll (optional) Module for U20-ASF-BT (Bluetooth SPP and BLE) devices   
·sgbledev.dll (optional) Module for U20-ASF-BT (Bluetooth BLE) devices

If a.NET application is 32-bit,the 32-bit versions of the dlls above are required,regardless of Windows systems.

Note that Visual Studio 2015 runtimes may need to be instaled.

For more information,refer to the separate document FDx SDK Pro Programming Manual.

# Chapter 2. Programming

All SDK functions are implemented_as members of the SGFingerPrintManager class. This chapter explains_how_to use the SGFingerPrintManager class to integrate SecuGen fingerprint technology into .NET applications.

# 2.1. Creating SGFingerPrintManager Object

To use the SecuGen .NET component, the SGFingerPrintManager object must first be instantiated.This is done by calling the SGFingerPrintManager() constructor.

```txt
[C#] private SGFingerPrintManager m_FPM; //member variable ... m_FPM = new SGFingerPrintManager();   
[VB.NET] Dim m_FPM As SGFingerPrintManager 'member variable ... m_FPM = New SGFingerPrintManager() 
```

# 2.2. Initializing SGFingerPrintManager Object

If an SGFingerPrintManager object is created,it should be initialized using Init(SGFPMDeviceName devName) or Init(lnt32 width, Int32 height, Int32 dpi). Init(SGFPMDeviceName devName) takes the device name,loads the driver that corresponds to the device name,and initializes the fingerprint algorithm module based on device information. Init (Int32 imageWidth, Int32 imageHeight, Int32 dpi) takes image information to initialize fingerprint algorithm module.It does not load device driver.

# ·Initiailize SGFingerPrintManage with device name

The Init(SGFPMDeviceName devName) function takes a device name as a parameter. Based on the device name,SGFingerPrintManager loads the required device driver module and initializes the extraction and matching modules based on device information. The folowing table summarizes the relationships among Device Type，Device Name， loaded Device Driver，and initial Image Size when the Init(SGFPMDeviceName devName) function is called.

![](images/ac4e992307c4d496b27d9f6c5c881d1c72f0df80527cef4a6e6dd4c530a49bb7.jpg)

[C#]

```txt
private SGFingerPrintManager m_FPM; //member variable  
...  
SGFPMDeviceName device_name = SGFPMDeviceName.Dev_FDU05;  
m_FPM = new SGFingerPrintManager(device_name); 
```

[VB .NET]

```txt
Dim m_FPM As SGFingerPrintManager 'member variable  
...  
Dim device_name As SGFPMDevicename  
device_name = SGFPMDevicename.Dev_FDU05  
m_FPM = New SGFINGERPRINTMANAGER(device_name) 
```

# •Initiailize SGFingerPrintManager without device

In some applications,you may need to use the SGFingerPrintManager class without a SecuGen reader installed on the system.In this case，you can use the overload InitEx2³ (lnt32 imageWidth,Int32 imageHeight, Int32dpi, String *licenseFilePath).It takes image width,image height,resolutionand the path to a license file as parameters.If this function is caled for initializing SGFingerPrintManager, the SGFingerPrintManager class does not load the device driver.

[C#]

```c
private SGFingerPrintManager m_FPM; //member variable  
...  
Int32 image_width = 300;  
Int32 image_height = 400;  
Int32 image_dpi = 500;  
String pathToLicense = "license.dat"; 
```

```txt
m_FPM = new SGFingerPrintManager();  
err = m_FPMInitEx2(image_width, image_height, image_dpi, pathToLicense); 
```

[VB.NET]   
```vba
Dim m_FPM As SGFingerPrintManager 'member variable   
...   
Dim image_width As Int32   
Dim image_height As Int32   
Dim image_dpi As Int32   
Dim pathToLicense As String   
image_width = 300   
image_height = 400   
image_dpi = 500   
pathToLicense = "license.dat"   
m_FPM = New SGFingerPrintManager()   
err = m_FPM.IntInitEx2(image_width, image_height, image_dpi, pathToLicense) 
```

# 2.3. Opening the SecuGen Fingerprint Reader

To use a SecuGen fingerprint reader,the reader must first be initialized by caling the OpenDevice() method. The portAddr parameter can have diferent meanings depending on which type of fingerprint reader is used.

For USB readers, portAddr represents the device ID. If only one USB fingerprint reader is connected to the PC,the device ID willhave the value O.If multiple USB fingerprint readers are connected to one PC, portAddr can range from O to 9.The maximum number of SecuGen USB readers that can be connected to one PC is 10.

If portAddr is 0 (AUTO_DETECT), the device driver willfind the port address automatically.

For Serial readers such as U20-ASF-BT (SPP), portAddr is a com port.

For U20-ASF-BT(BLE)devices,the OpenDevice(string) method should be called with the device ID string, which can be retrieved by calling the FindDevices() method.

In general, if only one USB reader is connected to the PC,then SGFPMPortAddr.USB_AUTO_DETECT is recommended.

USB Readers: Values used in PortAddr parameter

![](images/a003090df4642ca820ffafcc1e5ef660dd10675660522fff46e5831839953d1a.jpg)

[C#]

[C#] Int32 port_addr; ... port_addr $=$ SGFPMPortAddr.USB_AUTO_DETECT; iError $=$ m_FPM.OpenDevice.port_addr); if (iError $= =$ (Int32)SGFPMError失误客户提供 StatusBar.Text $\equiv$ "Initialization Success"; else StatusBar.Text $\equiv$ "OpenDevice() Error : $" +$ iError;   
[VB.NET] Dim port_addr As Int32 port_addr $=$ SGFPMPortAddr.USB_AUTO_DETECT; iError $=$ m_FPM.OpenDevice.port_addr) If (iError $=$ SGFPMError.Error NONE) Then StatusBar.Text $\equiv$ "Initialization Success" Else StatusBar.Text $\equiv$ "OpenDevice() Error : $" +$ Convert.ToString(iError) End If

# 2.4. Getting Device Information

Device information can be retrieved by caling the GetDevicelnfo() method,which obtains required device information such as image height and width.

[C#]

```txt
SGFPMDeviceInfoParam pInfo = new SGFPMDeviceInfoParam();  
pInfo = new SGFPMDeviceInfoParam();  
Int32 iError = m_FPM.GetDeviceInfo(pInfo);  
if (iError == (Int32)SGFPMError失误_NON) {  
    // This should be done GetDeviceInfo();  
    m/ImageWidth = pInfo.ImageWidth;  
    m/ImageHeight = pInfo.ImageHeight;  
} 
```

[VB.NET]

```vba
Dim pInfo As SGFPMDDeviceInfoParam  
Dim iError As Int32  
pInfo = New SGFPMDDeviceInfoParam  
iError = m_FPM.GetDeviceInfo(pInfo)  
If (iError = SGFPMError.ErrOR_NONE) Then  
    m/ImageWidth = pInfo.ImageWidth  
    m/ImageHeight = pInfo.ImageHeight  
End If 
```

For U20-ASF-BT (BLE) devices,the FindDevices() method can be used to get the property of devices

such as name and ID string. To cancel finding devices, the CancelFind() method can be called.

[C#]

```cs
void FindDevices(SGFingerPrintManager fpm) { uint ndevs = 0; uint timeout = 10000; // 10 seconds, millisecond int res = fpm.FindDevices(ref ndevs, timeout); Assert.IsTrue(res == (int)SGFPMError失误=None); Console.WriteLine("\{0\} devic(s) found.", ndevs); if (ndevs > 0) { SGFPMDevi eInfo devInfo = new SGFPMDevi eInfo(); for (int i = 0; i != ndevs; i++) { res = fpm.GetDeviceInfoFound(i, devInfo); string name = new string(devInfo.ID); string id = new string(devInfo.Name); Console.WriteLine("Name: {0}, ID: {1}", name, id); } } 
```

# 2.5. Capturing a Fingerprint Image4

After the reader is initialized,a fingerprint image can be captured using the Getlmage() method.The captured fingerprint is a 256 gray-level image,and image width and height can be retrieved using the GetDevicelnfo() method.The image buffer should be allocated by the host application before callng this Getlmage() method. There are 2 types of image capturing functions-Getlmage() and GetlmageEx().

GetImage() captures one image without additional requirements. But If Getlmage() needs to be called multiple times,it is recommended to callBeginGetlmage() before and EndGetlmage() after the series of calls for Getlmage().This willalow Getlmage() to run faster if the device,such as U-Air, supports these two functions. For more information, please review the MatchingUAlR sample code.

GetImageEx() captures fingerprint images continuously，checks the image quality against a specified quality value,and ignores the image if it does not contain a fingerprint or if the qualityof the fingerprint is not acceptable.If a quality image is captured within the given time (the second parameter), GetlmageEx() ends its processing.

# ·Getlmage() Example

[C#]

```txt
Byte[] fp_image = new Byte[m/ImageWidth*m/ImageHeight];  
Int32 iError;  
iError = m_FPM.GetImage(fp_image);  
if (iError == (Int32)SGFPMError失误=None) { 
```

DrawImage(fp_image, pictureBox1);   
}   
else   
StatusBar.Text $=$ "GetImage() Error : $" +$ iError;

[VB.NET]   
```vba
Dim fp_image() As Byte  
Dim iError As Int32  
ReDim fp_image(m/ImageWidth * m/ImageHeight)  
iError = m_FPM.GetImage(fp_image)  
If (iError = SGFPMError失误=None) Then  
    DrawImage(fp_image, pictureBox1)  
Else  
    StatusBar.Text = "GetImage() Error: " + Convert.ToString(iError)  
End If 
```

# ·GetlmageEx() Example

[C#]   
Int32 iError;   
Int32 timeout $= 10000$ .   
Int32 quality $= 80$ .   
Byte[] fp_image $\equiv$ new Byte[m/ImageWidth*m/ImageHeight];   
iError $=$ m_FPM.GetImageEx(fp_image,timeout,this.pictureBox1.Handle.ToInt32(), quality);

[VB .NET]   
```vba
Dim fp_image() As Byte
Dim iError As Int32
Dim timeout As Int32
Dim quality As Int32
ReDim fp_image(m/ImageWidth * m/ImageHeight)
timeout = 10000
quality = 80
iError = m_FPM.GetLiveEx(fp_image, timeout, pictureBox1.Handle.ToInt32(), quality)
If (iError = SGFPMError失误=None) Then
Else
StatusBar.Text = "GetImage() Error: " + Convert.ToString(iError)
End If 
```

# ·CreateTemplateDev() Example (U20-ASF-BT only)

[C#]   
```txt
void CreateTemplateDev() { // see what template format is. 
```

int templateFormat $= 0$ int res $=$ _fpm.GetTemplateFormatDev(ref templateFormat); Assert.IsTrue(res $= =$ (int)SGFPMError失误=None); // capture a fingerprint and create a template int sizeTemplate $= 0$ . res $=$ _fpm.CreateTemplateDev(ref sizeTemplate); Assert.IsTrue(res $= =$ (int)SGFPMError失误=None); // get a template byte[] min $=$ new byte[sizeTemplate]; res $=$ _fpm.GetTemplateDev(min); Assert.IsTrue(res $= =$ (int)SGFPMError失误=None); // save it SaveTemplate(min, templateFormat);   
}

# 2.6. Getting Image Quality

To determine the fingerprint image quality,you can use GetlmageQuality(). GetlmageQuality checks both image quality and minutiae quality. Alternatively, GetLastlmageQuality()5 can be used as a simple and fast way to check the quality of the last image captured from the device.

[C#]

```txt
m_FPM.GetImageQuality(m/ImageWidth, m/ImageHeight, fp_image, ref img_qlty); if (img_qlty < 80) // Capture again 
```

[VB . NET]

```txt
m_FPM.GetImageQuality(m/ImageWidth, m/ImageHeight, fp_image, img_qlty) If img_qlty < 80 then ' Capture again 
```

# 2.7. Controlling Brightness

Depending on the fingerprint reader used,environmentalfactors,and the specifications of the host system, the brightness of a fingerprint image may vary. To improve the quality of a captured image, the image brightness should be adjusted by controling the brightness setting of the reader using Configure() or SetBrightness(). Using Configure() presents a built-in dialog box in the driver from which the user can easily adjust brightness and receive instant feedback from the fingerprint image displayed. SetBrightness() can also be used to control brightness of the reader. Brightness default values vary among the diferent types of SecuGen readers.

# ·SetBrightness () Example

[C#]

iError $=$ m_FPM.SetBrightness(70);

[VB.NET] iError $=$ m_FPM.SetBrightness(70)

· Configure() Example

[C#] iError $=$ m_FPM.Configure();   
[VB.NET] iError $=$ m_FPM.Configure()

# 2.8. Creating a Template6

To register or verify a fingerprint, a fingerprint image is first captured,and then feature data (minutiae) is extracted from the image into a template. Minutie are the unique core points near the center of every fingerprint, such as ridges, ridge endings,bifurcations, valleys,and whorls.

Use CreateTemplate() to extract minutiae from a fingerprint image to form a template.The buffer should be assigned by the application.To get the bufer size of the minutiae,call GetMaxTemplateSize().It will return the maximum buffer size for data in one template.The actual template size can be obtained by calling GetTemplateSize() after the template is created. The CreateTemplate() APl creates only one set of data from an image.

Note: Templates having the ANSl378,ISO19794-2,or ISO19794-2 compact7 card formats may be merged. For more information about template formats and merging formats,refer to the following Sections:

Section 2.14 Template Format

Section 2.15 Manipulating ANSl378, ISO19794-2,and ISO19794-2 Compact Templates

```txt
[C#] Byte[] fp_image = new Byte[m/ImageWidth*m/ImageHeight]; Int32 iError = m_FPM.GetImage(fp_image); iError = m_FPM.CreateTemplate(fp_image, m_RegMin1); 
```

```txt
[VB.NET] Dim fp_image() As Byte ReDim fp_image(m/ImageWidth * m/ImageHeight) iError = m_FPM.GetImage(fp_image) iError = m_FPM.CreateTemplate(fp_image, m_RegMin1) 
```

When a templated is created, template information such as fingerprint position and view number can be inserted into a template.To insert a template information，use CreateTemplate(SGFPMFingerlnfo* fingerlnfo, Byte rawlmage[], Byte minTemplate[])

```txt
[C#] 
```

```txt
SGFPMFingerInfo finger_info = new SGFPMFingerInfo();  
finger_info.FingerNumber = SGFPMFingerPosition.FINGPOS_RT;  
finger_info.ImageQuality = (Int16)img_qlty;  
finger_info.ImpressionType = (Int16)SGFPMImpressionType.IMPTYPE_LP;  
finger_info.ViewNumber = 0;  
error = m_FPM.CreateTemplate(finger_info, fp_image, m_RegMin2); 
```

# 2.9. Matching Templates

Templates are matched during both registration and verification processes. During registration，it is recommended to capture at least two image samples per fingerprint for a higher degree of accuracy. The minutiae data from each image sample can then be compared against each other (i.e.matched)to confirm the quality of the registered fingerprints.This comparison is analogous to apassword confirmation routine that is commonly required for entering a new password.

During verification, newly input minutiae data is compared against registered minutiae data. Similar to the registration process,verification requires the capture of a fingerprint image follwed by extraction of the minutiae data from the captured image into a template.The security level can be adjusted according to the type of application. For example,the security level for an application using fingerprint-only authentication can be set higher than SGFPMSecurityLevel.Normal to reduce false acceptance (FAR).

To match templates,the FDx SDK Pro provides four kinds of matching functions.Each function requires two sets of template data for matching.

MatchTemplate(): This function matches templates having the same format as the default format. When calling this function，each template should include only one sample (or view) per template. The_default format is_SG400 (SecuGen proprietary format) but can be changed by calling SetTemplateFormat(). For more information about template formats， refer to Section 2.14 Template Format.   
MatchTemplateEx(): This function can match templates having diferent template formats.This function can also specify the template format for each template and can match templates that have multiple views per template.   
MatchAnsiTemplate(): This function is the same as MatchTemplateEx() except that it supports only ANSl378 templates.   
MatchlsoCompactTemplate(): This function is the same as MatchTemplateEx( except that it supports only ISO19794-2 compact card templates.

![](images/e856fa474ebae7eb6eb1e73eb2bf0ea987f118a731ae99b4219b8d1a4dad78a3.jpg)

# MatchTemplate() Example

[C#]

```objectivec
Int32 iError;  
bool matched = false;  
SGFPMSecurityLevel secu_level = SGFPMSecurityLevel.Normal; // Adjust this 
```

```txt
value according to application type  
iError = m_FPM.MatchTemplate(m_RegMin1, m_RegMin2, secu_level, ref matched); 
```

[VB .NET]   
Dim iError As Int32   
Dim matched As Boolean   
Dim secu_level As SGFPMSecurityLevel   
secu_level $=$ SGFPMSecurityLevel.Normal   
iError $=$ m_FPM.MatchTemplate(m_RegMin1, m_RegMin2, secu_level, matched)

# MatchAnsiTemplate () Example

[C#]   
Int32 iError;   
bool matched $=$ false;   
SGFPMSecurityLevel secu_level $\equiv$ SGFPMSecurityLevel.Normal; // Adjust this value according to application type   
iError $\equiv$ m_FPM.MatchAnsiTemplate(m_RegMin1,0,m_RegMin2,0,secu_level,ref matched);

[VB.NET]   
Dim iError As Int32   
Dim matched As Boolean   
Dim secu_level As SGFPMSecurityLevel   
secu_level $=$ SGFPMSecurityLevel.Normal 'Adjust this value according to application type   
iError $=$ m_FPM.MatchAnsiTemplate(m_RegMin1,0,m_RegMin2,0,secu_level,matched)

# MatchTemplateEx() Example

[C#]   
```txt
Int32 iError;  
bool matched = false;  
SGFPMSecurityLevel secu_level = SGFPMSecurityLevel.Normal; // Adjust this value according to application type  
iError = m_FPM.MatchTemplateEx(m_RegMin1, SGFPMTemplateFormat.SG400, 0, m_RegMin2, SGFPMTemplateFormat.ANSI378, 0, secu_level, ref matched); 
```

[VB .NET]   
```vba
Dim iError As Int32  
Dim matched As Boolean  
Dim secu_level As SGFPMSecurityLevel  
secu_level = SGFPMSecurityLevel.Normal 'Adjust this value according to application type  
iError = m_FPM.MatchTemplateEx(m_RegMin1, SGFPMTemplateFormat.SG400, 0, m_RegMin2, SGFPMTemplateFormat.ANSI378, 0, secu_level, matched) 
```

# 2.10. Registration process

To register a fingerprint, a fingerprint image is firstcaptured,and then feature data (minutiae)is extracted from the image into a template.It is recommended to capture at least two image samples per fingerprint for a higher degree ofaccuracy.The minutiae data from each image can then be compared against each other (i.e.matched) to confirm the quality of the registered fingerprints.This comparison is analogous to a password confirmation routine that is commonly required for entering a new password.

# Overview of Registration Process

1.Capture fingerprint images: Getlmage() or GetlmageEx()   
2.Extract minutiae from each captured fingerprint image: CreateTemplate()   
3.Match each template to determine if they are acceptable for registration: MatchTemplate()   
4. Save templates to file or database for future use

# Example: Using two fingerprint images to register one fingerprint

[C#]

```objectivec
Int32 max_template_size = 0;  
m_FPM.GetMaxTemplateSize(ref max_template_size);  
Byte[] m_RegMin1 = new Byte[max_template_size];  
Byte[] m_RegMin2 = new Byte[max_template_size];  
Byte[] fp_image = new Byte[m/ImageWidth*m/ImageHeight];  
// Get 1st sample  
m_FPM.CreateTemplate(fp_image);  
m_FPM.CreateTemplate(fp_image, m_RegMin1);  
// Get 2nd sample  
iError = m_FPM.CreateImage(fp_image);  
iError = m_FPM.CreateTemplate(fp_image, m_RegMin2);  
// Match for registration  
bool matched = false;  
SGFPMSecurityLevel secu_level = SGFPMSSecurityLevel.Normal;  
iError = m_FPM.MatchTemplate(m_RegMin1, m_RegMin2, secu_level, ref matched);  
// if matched, save minutiae data to file or database 
```

[VB .NET]

```vba
Dim max_template_size As Int32  
Dim fp_image() As Byte  
Dim matched As Boolean  
Dim secu_level As SGFPMSecurityLevel  
ReDim fp_image(m/ImageWidth * m/ImageHeight)  
'Get 1st sample  
m_FPM.GetImage(fp_image)  
m_FPM.CreateTemplate(fp_image, m_RegMin1) 
```

Get 2nd sample   
m_FPM.GetImage(fp_image)   
m_FPM.CreateTemplate(fp_image，m_RegMin2)   
'Match for registration   
secu_level $=$ SGFPMSecurityLevel.Normal   
m_FPM.MatchTemplate(m_RegMin1，m_RegMin2，secu_level，matched)

# 2.11. Verification Process

The verification process involves matching newly input minutiae data against registered minutiae data. Similar to the registration process，verification requires the capture of a fingerprint image folowed by extraction of the minutiae data from the captured image into a template.

# Overview of Verification Process

1. Capture fingerprint image: Getlmage() or GetlmageEx()   
2.Extract minutiae data from captured image: CreateTemplate()   
3.Match newly made template against registered templates: MatchTemplate(), MatchTemplateEx(), MatchAnsiTemplate(), MatchlsoTemplate(), or MatchlsoCompactTemplate()

- Adjust the security level according to the type of application.For example,if fingerprint-only authentication is used, the security level can be set higher than SGFPMSecurityLevel.Normal to reduce false acceptance (FAR).

# Example: Input minutiae data is matched against two registered minutiae data samples

[C#]

Int32 iError;   
Byte[] fp_image $\equiv$ new Byte[m/ImageWidth*m/ImageHeight]; SGFPMSecurityLevel secu_level $=$ SGFPMSecurityLevel.Normal; // Adjust this value according to application type   
bool matched1 $=$ false;   
bool matched2 $=$ false;   
//Step 1: Capture Image m_FPM.GetImage(fp_image);   
// Step 2: Create Template m_FPM.CreateTemplate(fp_image, m_VrfMin);   
// Step 3: Match for verification against registered template- m_RegMin1, m_RegMin2 iError $=$ m_FPM.MatchTemplate(m_RegMin1, m_VrfMin, secu_level, ref matched1); iError $=$ m_FPM.MatchTemplate(m_RegMin2, m_VrfMin, secu_level, ref matched2); if (iError $= =$ (Int32)SGFPMError_EROR_NONE) { if (matched1 & matched2) StatusBar.Text $=$ "Verification Success";

else StatusBar.Text $=$ "Verification Failed";   
}   
else StatusBar.Text $=$ "MatchTemplate() Error : " + iError;

[VB.NET]   
```vba
Dim iError As Int32   
Dim fp_image() As Byte   
Dim matched1 As Boolean   
Dim matched2 As Boolean   
Dim secu_level As SGFPMSecurityLevel   
ReDim fp_image(m/ImageWidth * m/ImageHeight)   
'Step 1: Capture Image   
iError = m_FPM.GetImage(fp_image)   
'Step 2: Create Template   
iError = m_FPM.CreateTemplate(fp_image, m_VrfMin)   
'Step 3: Match for verification against registered template- m_RegMin1, m_RegMin2   
secu_level = SGFPMSecurityLevel.Normal 'Adjust this value according to application type   
iError = m_FPM.MatchTemplate(m_RegMin1, m_VrfMin, secu_level, matched1)   
iError = m_FPM.MatchTemplate(m_RegMin2, m_VrfMin, secu_level, matched2)   
If (iError = SGFPMSError_ERROR_NONE) Then If (matched1 And matched2) Then StatusBar.Text = "Verification Success" Else StatusBar.Text = "Verification Failed" End If   
Else StatusBar.Text = "MatchTemplate() Error : " + Convert.ToString(iError) End If 
```

# 2.12. Geting Matching Score

For improved quality control during the registration or verification process,a matching score can be used instead of a security level setting to determine the success of the operation.The matching score can be specified so that only sets of minutiae data that exceed the score willbe accepted; data below the score will be rejected.The matching score may have a value from O to 199. GetMatchingScore() requires two sets of minutiae data of the same template format. GetMatchingScoreEx() requires two sets of minutiae data,but they can take diferent template formats.For more information about template formats,refer to Section 2.14 Template Format.For more information about GetMatchingScoreEx(), refer to Section 3.1.2.4 Matching Functions.

[C#]   
```txt
Int32 match_score = 0;  
m_FPM.GetMatchingScore(m_RegMin1, m_RegMin2, ref match_score); 
```

```txt
[VB.NET] Dim match_score As Int32 match_score = 0 m_FPM.GetMatchingScore(m_RegMin1, m_RegMin2, match_score) 
```

To understand how the matching score correlates with typical security levels,refer to the folowing chart. For more information about security levels, refer to Section 3.1.2.4 Matching Functions.

Security Level vs. Matching Score   
![](images/e7c95b98d6cdb11dd9dcade5e7ad2d99a77ce35fcb85c2ef4bb38cf86c485827.jpg)

Note: As of version 3.81 of FDx SDK Pro, the Matching Scores have changed.

# 2.13. Using Auto-On TM

Auto-OnTM is a function that allows the reader to automatically detect the presence of a finger without requiring the user to prompt the system before receiving afingerprint.To use this function,Auto-On should be enabled using EnableAutoOnEvent(). Once Auto-On is enabled,the application can receive a message from the device driver whenever an Auto-On event occurs in the reader.

When calling EnableAutoOnEvent()，pass the handle of the window which will receive the Auto-On message. The Auto-On message is defined as Ox8100 (FDxMessage.DEV_AUTOONEVENT).

Note: Auto-On is not supported by FDU02-based readers.

# ·Enabling Auto-On

```javascript
[C#] m_FPM.EnableAutoOnEvent(true, (int) this.Handle);   
[VB.NET] m_FPM.EnableAutoOnEvent(True, Me.Handle.ToInt32()) 
```

# ·Disabling Auto-On

```javascript
[C#] m_FPM.EnableAutoOnEvent(false,0);   
[VB.NET] m FPM.EnableAutoOnEvent(False,0)
```

# ·Handling Auto-On event in application

[C#]   
protected override void WndProc(ref Message message)   
{ if(message Msg $= =$ (int)SGFPMMessages.Dev_AUTOONEVENT) { if(message.WParam.ToInt32() $= =$ (Int32)SGFPMAutoOnEvent.FINGER_ON) StatusBar.Text $=$ "Device Message: Finger On"; else if(message.WParam.ToInt32() $= =$ (Int32)SGFPMAutoOnEvent.FINGER_OFF) StatusBar.Text $=$ "Device Message: Finger Off"; } base.WndProc(ref message);

[VB.NET]   
```vba
Protected Overrides Sub WndProc(ByVal msg As Message)  
If (msg Msg = SGFPMMessages.Dev_AUTOONEVENT) Then  
    If (msg.WParam.ToInt32() = SGFPMAutoOnEvent.FINGER_ON) Then  
        StatusBar.Text = "Device Message: Finger On"  
    ElseIf (msg.WParam.ToInt32() = SGFPMAutoOnEvent.FINGER_OFF) Then  
        StatusBar.Text = "Device Message: Finger Off"  
    End If  
End If  
MyBase.WndProc(msg)  
End Sub 
```

# 2.14. Template Format

The FDx SDK Pro supports four types of fingerprint template formats:

·SG400: SecuGen's proprietary template format   
·ANSI378: ANSl-INCITS 378-2004“Finger Minutiae Format for Data Exchange"   
IS019794-2: ISO/IEC 19794-2:2005 "Biometric Data Interchange Formats - Part 2: Finger Minutiae Data"   
IS019794-2 Compact8: ISO/IEC 19794-2:2005 "Biometric Data Interchange Formats- Part 2: Finger Minutiae Data" - Section 8.2 Compact Size Finger Minutiae Format (Compact Card Format)

As default， SGFingerPrintManager creates SecuGen proprietary templates (SG400). To change the template format, use SetTemplateFormat().

For U20-ASF-BT devices, the SetTemplateFormatDev() method can be used to change the format for CreateTemplateDev(). Note that the SetTemplateFormat() will not affect CreateTemplateDev().

SG400 templates are encrypted for high security and have a size of 400 bytes.ANSl378 and ISO19794-2 templates are not encrypted,and their size is variable depending on how many fingers are in the structure and how many minutiae points are found.

For more information about the ANSl378 template，refer to the standard document titled “Information technology - Finger Minutiae Format for Data Interchange,” (document number ANSl-INCITS 378-2004) available at the ANSl website http://webstore.ansi.org.

For more information about the ISO19794-2 and ISO19794-2 Compact templates,refer to the standard document titled “Information technology--Biometric Data Interchange Formats--Part 2: Finger Minutiae Data,"(document number ISO / IEC 19794-2:2005) available at the ISO website https://www.iso.org/standard/38746.html.

Template format   
![](images/e2c2d0e86800fb5584744a04c13f5c1d9ecf6dd27de79e3a7217a717c555da6b.jpg)

# ·Setting template format to ANSl378

```txt
[C#] m_FPM.SetTemplateFormat(SGFPMTemplateFormat.ANSI378);   
[VB.NET] m_FPM.SetTemplateFormat(SGFPMTemplateFormat.ANSI378); 
```

# ·Setting template format to ISO19794-2

```objectivec
[C#] m_FPM.SetTemplateFormat(SGFPMTemplateFormat.ISO19794);   
[VB.NET] m_FPM.SetTemplateFormat(SGFPMTemplateFormat.ISO19794); 
```

# .Setting template format to ISO19794-2 compact card format

```txt
[C#] m_FPM.SetTemplateFormat(SGFPMTemplateFormat.ISO19794_COMPACT);   
[VB.NET] m_FPM.SetTemplateFormat(SGFPMTemplateFormat.ISO19794_COMPACT); 
```

# ·Setting template format to SG400

```powershell
[C#] m_FPM.SetTemplateFormat(m_SGFPMTemplateFormat.SG400);   
[VB.NET] m_FPM.SetTemplateFormat(m_SGFPMTemplateFormat.SG400) 
```

The following functions are affected by SetTemplateFormat():

```txt
GetMaxTemplateSize()  
CreateTemplate() 
```

GetTemplateSize()  
MatchTemplate()  
GetMatchingScore()

The following APls work only when the template format is ANSl378:

GetTemplateSizeAfterMerge()  
MergeAnsiTemplate()  
MergeMultipleAnsiTemplate()  
GetAnsiTemplatelnfo()   
MatchAnsiTemplate()  
GetAnsiMatchingScore()

The following APls work only when the template format is ISO19794:

GetlsoTemplateSizeAfterMerge()  
MergelsoTemplate()   
MergeMultiplelsoTemplate()  
GetlsoTemplatelnfo()   
MatchlsoTemplate()  
GetlsoMatchingScore()

The following APls work only when the template format is ISO19794_COMPACT:

GetlsoCompactTemplateSizeAfterMerge()  
MergelsoCompactTemplate()   
MergeMultiplelsoCompactTemplate()  
GetlsoCompactTemplatelnfo()   
MatchlsoCompactTemplate()  
GetlsoCompactMatchingScore()

The following APls work with any template format:

MatchTemplateEx()   
GetMatchingScoreEx()

# 2.15. Manipulating ANSl378, ISO19794-2， and ISO19794-2 Compact Templates

The ANSl378, ISO19794-2,and ISO19794-2 Compact template formats alow multiple fingers and multiple views per finger to be stored in a single template.To support this feature, FDx SDK Pro provides the following special APls:

For ANSl378 Templates:

GetTemplateSizeAfterMerge()  
MergeAnsiTemplate()  
MergeMultipleAnsiTemplate()  
GetAnsiTemplatelnfo()   
MatchAnsiTemplate()  
GetAnsiMatchingScore()

For ISO19794-2 Templates:

GetlsoTemplateSizeAfterMerge()  
MergelsoTemplate()   
MergeMultiplelsoTemplate()  
GetlsoTemplatelnfo()

```txt
- MatchlsoTemplate()
- GetlsoMatchingScore() 
```

For ISO19794-2 Compact Card Templates:

```autoit
GetIsoCompactTemplateSizeAfterMerge()  
MergelsoCompactTemplate()  
MergeMultipleIsoCompactTemplate()  
GetIsoCompactTemplateInfo()  
MatchIsoCompactTemplate()  
GetIsoCompactMatchingScore()
```

# ·Merging two ANSl378 templates

After creating an ANSl378 template from a fingerprint image,additional ANSl378 templates can be merged into one template.To do this, use MergeAnsiTemplate(), which takes two ANSl378 templates and merges them into one template.The size of the merged template willbe smaller than the sum of the sizes of all input templates.Call GetTemplateSizeAfterMerge() to obtain the exact template size of the merged template before using MergeAnsiTemplate().

[C#]

```txt
// Get first fingerprint image and create template from the image  
err = GetImageEx(m_ImgBuf);  
err = CreateTemplate(m_ImgBuf, m_RegMin1);  
// Get second fingerprint image and create template from the image  
err = GetImageEx(m_ImgBuf);  
err = CreateTemplate(m_ImgBuf, m_RegMin2);  
Byte[] merged_template;  
Int32 buf_size = 0;  
m_FPM.GetTemplateSizeAfterMerge(m_RegMin1, m_RegMin2, ref buf_size);  
merged_template = new Byte[buf_size];  
m_FPM.MergeAnsiTemplate(m_RegMin1, m_RegMin2, merged_template); 
```

# ·Getting information about an ANSl378 template

The ANSl378 template format alows multiple fingers and multiple views per finger to be stored in one template.To match one sample (view)against a sample in other template, information about the template may be needed. To get sample information about a template, use GetAnsiTemplatelnfo().

[C#]

```c
Int32 err;  
SGFPMFingerPosition finger_pos = SGFPMFingerPosition.FINGPOS_UK;  
bool finger_found = false;  
SGFPMANSITemplateInfo sample_info = new SGFPMANSITemplateInfo();  
err = m_FPM.GetAnsiTemplateInfo(m StoredTemplate, sample_info);  
for (int i = 0; i < sample_info.TotalSamples; i++)  
{  
    bool matched = false;  
    err = m_FPM.MatchAnsiTemplate(m StoredTemplate, i, m_VrfMin, 0, m_SecurityLevel, ref matched);  
    if (matched)  
{ 
```

```txt
finger_found = true;
finger_pos = (SGFPMFingerPosition) sample_info/sampleInfo[i].FingerNumber;
break;
}
if (err == (Int32) SGFPMError失误_NONE)
{
    if (finger_found)
        StatusBar.Text = "The matched data found. Finger position: " + fingerpos_str[(Int32)finger_pos];
    else
        StatusBar.Text = "Cannot find a matched data";
}
else
 StatusBar.Text = "MatchAnsiTemplate() Error : " + err; 
```

# 2.16. Geting Version Information of MINEX Certified Algorithm

To obtain version information about the MINEXCertified algorithms,use GetMinexVersion().Currently,the extractor version number is Ox000A0035,and the matcher version number is Ox000A8035.

[C#]

```txt
Int32 extractor = 0  
Int32 matcher = 0;  
err = m_FPM.GetMinexVersion(ref extractor, ref matcher); 
```

# Chapter 3. SecuGen.FDxSDKPro.Windows Reference

# 3.1. SGFingerPrintManager Class

Name Space: SecuGen.FDxSDKPro.Windows

Assembly Name: SecuGen.FDxSDKPro.DotNet.Windows.dllor SecuGen.FDxSDKPro.Windows.dll

# 3.1.1. Constructor

# SGFingerPrintManager()

Creates a new instance of the SGFingerPrintManager class.This constructor takes the device name or device type as an argument.

# 3.1.2. Methods

# 3.1.2.1. Initialization Functions

# Int32 Init(SGFPMDeviceName deviceName)

Initializes the SGFingerPrintManager with deviceName.Loads device driver with device name and initializes algorithm modules based on device information.

# . Parameters

# deviceName :

Specifies SecuGen device name.The device name determines how the driver, extraction and matching modules are initialized.

DEV_FDUo2: device name for FDU02-based USB readers   
DEV_FDU03: device name for FDU03 and SDU03-based USB readers   
DEV_FDU04: device name for FDU04 and SDU04-based USB readers   
DEV_FDUo5: device name for U20-based USB readers   
DEV_FDUo6: device name for UPx-based USB readers   
DEV_FDU06AP: device name for UPx-AP based USB readers   
DEV_FDUo7: device name for U10-based USB readers   
DEV_FDUo8: device name for U20-A based USB readers   
DEV_FDUo8A: device name for U20-AP based USB readers   
DEV_FDUo8AL: device name for U20-AL based USB readers   
DEV_FDUo9A: device name for U30 based USB readers   
DEV_FDU10A: device name for U-AIR based contactless USB readers   
DEV_FDUSDA: device name for U20-ASF-BT (Bluetooth SPP) based readers   
DEV_FDUSDA_BLE: device name for U20-ASF-BT (Bluetooth BLE) based readers   
DEV_AUTO: device name for any devices above

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_LOAD_DRIVER_MODULE= Failed to load device driver

SGFPMError:ERROR_LOAD_EXTRACTION_MODULE= Failed to load extraction module SGFPMError:ERROR_LOAD_MATCHING_MODULE= Failed to load matching module

Int32 InitEx29(Int32 imageWidth, Int32 imageHeight, Int32 imageDPl, String pathToLicense) Initializes SGFingerPrintManager with image information. Use when running fingerprint algorithm module without a SecuGen reader.

. Parameters

imageWidth:

Image width in pixels

imageHeight:

Image height in pixels

imageDPl:

Image resolution in DPI

pathToLicense:

Path to a license file

Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_LOAD_EXTRACTION_MODULE = Failed to load extraction module

SGFPMError:ERROR_LOAD_MATCHING_MODULE = Failed to load matching module

Int32 SetTemplateFormat (SGFPMTemplateFormat format)

Sets template format (default is SecuGen proprietary format,SG400)

. Parameters

Format:

template format

ANSI378: ANSI-INCITS 378-2004 format

IS019794: ISO/IEC 19794-2:2005 format

IS019794_COMPACT: ISO/IEC 19794-2:2005 compact card format

SG400: SecuGen proprietary format

Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE: Wrong template format

# 3.1.2.2. Device and Image Capturing functions

# Int32 EnumerateDevice()

Enumerates reader(s) currently attached to the system. After calling this function， use NumberOfDevice property and GetEnumDevicelnfo() method to get enumerated reader(s).

Returned values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_FUNCTION_FAILED = General function fail error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter has been used

Int32 GetEnumDevicelnfo(Int32 nDevs, SGFPMDeviceList* devList)

Gets list of readers currently attached to PC. Call GetEnumDevicelnfo() after calling EnumerateDevice() method.

. Parameters

ndevs

The number of attached USB readers

devList

Buffer that contains device ID and device serial number. For more information, see Section 3.3

SGFPMDeviceList structure

# int FindDevices(ref uint ndevs, uint timeout)

Find U20-ASF-BT (BLE) devices.

Parameters

ndevs:

The number of U20-ASF-BT (BLE) devices found

timeout:

Timeout in millisecond

Return values

SGFPMError:ERROR_NONE = No eror

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter was used

SGFPMError:ERROR_SYSLOAD_FAILED = Failed to load system files

SGFPMError:ERROR_INITIALIZE_FAILED = Failed to initialize chip

SGFPMError:ERROR_DLLLOAD_FAILED= Failed to load module

# int GetDevicelnfoFound(int ndev, SGFPMDevicelnfo devlnfo)

Find the info of the U20-ASF-BT (BLE)device found by calling FindDevices().

. Parameters

ndev:

The index of the U20-ASF-BT (BLE) device found to get the info of.

devinfo:

A buffer where the info will be written.

Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter was used

SGFPMError:ERROR_SYSLOAD_FAILED = Failed to load system files

SGFPMError:ERROR_INITIALIZE_FAILED = Failed to initialize chip

SGFPMError:ERROR_DLLLOAD_FAILED = Failed to load module

# int CanelFind()

Cancel finding U20-ASF-BT(BLE) devices.The FindDevices() method willstop and return immediately.

Return values

SGFPMError::ERROR NONE = No error

SGFPMError::ERROR_INVALID_PARAM = Invalid parameter Was used

SGFPMEror:ERROR_SYSLOAD_FAILED = Failed to load system files

SGFPMError:ERROR_INITIALIZE_FAILED = Failed to initialize chip

SGFPMError:ERROR_DLLLOAD_FAILED= Failed to load module

# Int32 OpenDevice(Int32 port)

Initializes the fingerprint reader

. Parameters

port:

If a USB reader is attached, the argument specifies the device ID (from O to 9). If the device

ID is unknoWn, pass SGFPMProtAddr:USB_AUTO_DETECT. If the port is

SGFPMPortAddr:AUTO_DETECT,the device driver wil find its port address automaticaly

For USB readers, paSs SGFPMPortAddr:USB_AUTO_DETECT or 0-9.

# Return values

SGFPMError:ERROR_NONE= No error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter was used

SGFPMEror:ERROR_SYSLOAD_FAILED = Failed to load system files

SGFPMError:ERROR_INITIALIZE_FAILED= Failed to initialize chip

SGFPMError:ERROR_DLLLOAD_FAILED= Failed to load module

SGFPMError:ERROR_DEVICE_NOT_FOUND= Device not found

# Int32 OpenDevice(string id)

Initializes the U20-ASF-BT (BLE) reader

# . Parameters

id:

A ID string from the FindDevices() method. For instance, it will have like in c#:

string id = "BluetoothLE#BluetoothLEac:d1:b8:d0:d6:e4-cc:35:5a:ff:f0:37";

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError::ERROR_INVALID_PARAM = Invalid parameter was used

SGFPMError:ERROR_SYSLOAD_FAILED = Failed to load system files

SGFPMError:ERROR_INITIALIZE_FAILED= Failed to initialize chip

SGFPMError:ERROR_DLLLOAD_FAILED= Failed to load module

SGFPMError::ERROR_DEVICE_NOT_FOUND = Device not found

# Int32 CloseDevice()

Closes a currently opened reader

# Parameters

None

# . Return values

SGFPMError::ERROR_NONE= No error

# Int32 Configure(int hwnd)

Displays the driver's configuration dialog box

# Parameters

hwnd

The parent window handle

# Return values

SGFPMError:ERROR_NONE= No error

# Int32 SetBrightness(lnt32 brightness)

Controls brightness of image sensor

# . Parameters

brightness

Brightness value (from 0 to 100)

# Return values

SGFPMError::ERROR_NONE = No error

SGFPMError::ERROR_INVALID_PARAM = Invalid parameter Was used

# Int32 SetLedOn(bool on)

Turns optic unit LED on/off

# . Parameters

on

true: Turns on LED

false: Turns off LED

# .Return values

SGFPMError:ERROR_NONE = No error

# Int32 Getlmage(Byte buffer[l)

Captures a 256 gray-level fingerprint image from the reader. The image size can be retrieved by caling GetDevicelnfo(). Getlmage() does not check for image quality. To get image quality of a captured image，use GetlmageQuality(). To get the approximate image quality while capturing，use GetimageEx().

# . Parameters

buffer

Apointer to the buffer containing a fingerprint image.The image size can be retrieved by caling GetDevicelnfo()

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMEror:ERROR_WRONG_IMAGE = Captured image is not a real fingerprint

SGFPMError:ERROR_INVALID_PARAM= An invalid parameter has been used

SGFPMError:ERROR_LINE_DROPPED = Image data is lost

# Int32 BeginGetlmage()

Prepares for Getlmage() to start capture. Must call EndGetlmage() later.

# . Parameters

# Return values

SGFPMError::ERROR NONE = No error

SGFPMError:ERROR_INVALID_PARAM = An invalid parameter has been used

SGFPMError:ERROR_UNSUPPORTED_DEV= Not supported

# Int32 EndGetlmage()

Closes for Getlmage() to finish capture

# . Parameters

None

# . Return values

SGFPMError:ERROR_NONE = No error

SGFPMError::ERROR INVALID_PARAM = An invalid parameter has been used

SGFPMEror:ERROR_UNSUPPORTED_DEV= Not supported

# Int32 GetlmageQuality(lnt32 width, Int32 height, Byte imgBuf[], Int32* quality)

Gets the quality of a captured (scanned) image.The value is determined by two factors. One is the ratio of the fingerprint image area to the whole scanned area, and the other is the ridge quality of the fingerprint image area. A quality value of 50 or higher is recommended for registration. A quality value of 40 or higher is recommended for verification.

Note: The returned quality value is different from the value used in GetlmageEx().The quality value in GetlmageEx() represents only the ratio of the fingerprint image area to the whole scanned area.

# Parameters

width

Image width in pixels

height

Image height in pixels

imgBuf

Fingerprint image data

quality

The return value indicating image quality

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError::ERROR_INVALID_PARAM = Invalid parameter Was used

# Int32 GetLastlmageQuality(ref int quality)

Gets the quality of the last captured (scanned) image. The value is determined only by one fact, which is the ridge quality of the fingerprint image area. A quality value of 70 or higher is recommended for registration. Aquality value of 50 or higher is recommended for verification.The value ranges from zero to 100.

Note: Not all devices support this function. Therefore, the return value should be checked.

# . Parameters

quality

The return value indicating image quality

# Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter was used

SGFPMError:ERROR_UNSUPPORTED_DEV= Not supported

# Int32 GetlmageEx(Byte buffer[], Int32 time, int dispWnd , Int32 quality)

Captures fingerprint images from the device until the quality of the image is greater than the value of the quality parameter.The captured fingerprint is a 256 gray-level image;image size can be retrieved by caling the GetDevicelnfo() function.Aquality value of 50 or higher is recommended for registration. A quality value of 40 or higher is recommended for verification.

Note: The returned quality value is diferent from the value used in Getlmage().The quality value in GetlmageEx() represents only the ratio of the fingerprint image area to the whole scanned area.

# . Parameters

buffer

Pointer to bufer containing a fingerprint image

timeout

The timeout value (in milliseconds) used to specify the amount of time the function will wait for a valid fingerprint to be input on the fingerprint reader

dispWnd

Window handle used for displaying fingerprint images

quality

The minimum quality value of an image,used to determine whether to accept the captured

image

# . Return values

SGFPMError::ERROR_NONE= No error

SGFPMError:ERROR_INVALID_PARAM = An invalid parameter has been used

SGFPMError:ERROR_LINE_DROPPED = Image data was lost

SGFPMError:ERROR_TIME_OUT = No valid fingerprint captured in the given time

# Int32 EnableAutoOnEvent (bool enable, int hwnd)

Allows the reader to automatically detect the presence of a finger without requiring the user to prompt the system before receiving a fingerprint. EnableAutoOnEvent() enables or disables the Auto-On function. Once Auto-On is enabled,the application can receive a message from the device driver whenever an Auto-On event occurs in the device. (Not supported by FDUo2-based readers.)

When calling EnableAutoOnEvent()，pass the handle of the window that willreceive the Auto-On message. The Auto-On message(SGFPMMessages) is defined as Ox8100.

# Parameters

enable

true: enables Auto-On

false: disables Auto-On

hwnd

Window handle to receive Auto-On message

# Return values

SGFPMError:ERROR NONE = No error

SGFPMError:ERROR_INVALID_PARAM= An invalid parameter has been used

# Remarks

When the application receives an Auto-On message, wParam willhave event type (Finger ON or OFF) and IParam will have information of the device from which the event occurred.

wParam:

Contains event type.

SGFPMAutoOnEvent:FINGER_ON(1) = Finger is on the sensor

SGFPMAutoOnEvent:FINGER_OFF(0)= Finger is removed from the sensor

IParam:

Contains device information. The device information is contained in

SGFPMDevicelnfoParam.

# 3.1.2.3. Extraction Functions

# Int32 GetMaxTemplateSize(lnt32* size)

Gets the maximum size of a fingerprint template (view or sample). Use this function before using CreateTemplate() to obtain an appropriate buffer size. If the template format is SG400, it returns a fixed length size of 400. Note: The returned template size means the maximum size of one view or sample.

# . Parameters

size

The pointer to contain template size

# Return values

SGFPMError:ERROR_NONE= No error

# Int32 CreateTemplate(Byte rawlmage[], Byte minTemplate[])

Extracts minutiae from a fingerprint image to form a template having the default format

# . Parameters

rawlmage

256 Gray-level fingerprint image data

# minTemplate

Pointer to bufer containing minutiae data extracted from a fingerprint image

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_FEAT_NUMBER = Inadequate number of minutia

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMEror:ERROR_INVALID_TEMPLATE1= 103 = Eror while decoding template 1

SGFPMError:ERROR_INVALID_TEMPLATE2 = 104 = Eror while decoding template 2

# Int32 CreateTemplate(SGFPMFingerlnfo* fplnfo, Byte rawlmage[], Byte minTemplate[)

Extracts minutiae from a fingerprint image to form a template having the default format

# Parameters fpInfo

Fingerprint information stored in a template.For ANSl378 templates,this information can be retrieved from the template using GetAnsiTemplatelnfo().For ISO19794 templates，this information can be retrieved from the template using GetlsoTemplatelnfo().For IS019794_COMPACT templates, this information can be retrieved from the template using GetlsoCompactTemplatelnfo(). For SG400 templates, this information cannot be seen in the template. For more information, refer to Section 3.4 SGFPMFingerlnfo Structure.

# rawlmage

256 Gray-level fingerprint image data

# minTemplate

Pointer to buffer containing minutiae data extracted from afingerprint image

# Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_FEAT_NUMBER= Inadequate number of minutia

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMEror:ERROR_INVALID_TEMPLATE1= 103 = Error while decoding template 1

SGFPMError:ERROR_INVALID_TEMPLATE2 = 104 = Error while decoding template 2

# int CreateTemplateDev(ref int size)

Captures a fingerprint image and extracts minutiae to form a template having the default format.

To get the template,call GetTemplateDev() with a buffer having the size. (U20-ASF-BT only)

# . Parameters

# size

The size of the template created

# Return values

SGFPMError::ERROR NONE = No error

SGFPMError::ERROR_FUNCTION_FAILED

# int GetTemplateDev(byte[] min)

Gets the template. (U20-ASF-BT only)

# Parameters min

An array of bytes with the size of the template returned by CreateTemplateDev().

# . Return values

SGFPMError:ERROR_NONE = No error

SGFPMError::ERROR_FUNCTION_FAILED

# Int32 GetTemplateSize(Byte minTemplate[], Int32* size)

Gets template size. If the template format is SG40o,it willreturn 400.If te template format is ANSl378, ISO19794, or ISO19794_COMPACT, template size willbe varied.

Parameters

minTemplate

Pointer to bufer containing minutiae data extracted from a fingerprint image e

The pointer to contain template size

Return values

SGFPMError::ERROR_NONE= No error

# 3.1.2.4. Matching Functions

# Int32 MatchTemplate(Byte minTemplate1[], Byte minTemplate2[], SGFPMSecurityLevel secuLevel, bool* matched)

Compares two sets of minutiae data of the same template format. The template format should be the same as that set by SetTemplateFormat() and should include only one sample.To match templates thathavemorethanonesample， useMatchTemplateEx()， MatchAnsiTemplate(), MatchlsoTemplate(),or MatchlsoCompactTemplate. It returns true or false as a matching result (matched). The security level (secuLevel) will affect matching result and may be adjusted according to the security policy required by the user or organization.

. Parameters

minTemplate1

A pointer tothe buffer containing minutiae data extracted from afingerprint image minTemplate2

A pointer to the bufer containing minutiae data extracted from a fingerprint image secuLevel

Security level (NORMAL is recommended for most purposes)

LOWEST

LOWER

LOW

BELOW_NORMAL

NORMAL

ABOVE_NORMAL

HIGH

HIGHER

HIGHEST

Matched

Contains matching result. If the passed templates are the same, then true is returned. If not, false is returned.

Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in minTemplate1

SGFPMError::ERROR_INVALID_TEMPLATE2= Eror in minTemplate2

# Int32 MatchTemplateEx(Byte minTemplate1[], SGFPMTemplateFormat tempateType1, Int32 sampleNum1, Byte minTemplate2[], SGFPMTemplateFormat templateType2, Int32 sampleNum2, Int32 secuLevel, bool* matched)

Compares two sets of minutiae data, which can be of diferent template formats (SG400, ANSl378, ISO19794,or ISO19794_COMPACT). It returns true or false as a matching result (matched). The security level (secuLevel) willaffct matching result and may be adjusted according to the security

policy required by the user or organization.

# . Parameters

# minTemplate1

A pointer to the buffer containing minutiae data extracted from a fingerprint image

# templateType1

Specifies format of minTemplate1 (SG400, ANSI378, ISO19794, or ISO19794_COMPACT)

# sampleNum1

Position of a sample to be matched in minTemplate1. If templateType1 is ANSl378, IS019794, or ISO19794_COMPACT, it can have a value from O to the number of samples minus 1 in minTemplate1. If templateType1 is SG400, this value is ignored.

# minTemplate2

A pointer to the buffer containing minutiae data extracted from a fingerprint image

# templateType2

Specifies format of minTemplate2 (SG400, ANSI378, ISO19794, or ISO19794_COMPACT) sampleNum2

Position of a sample to be matched in minTemplate2. If templateType2 is ANSl378, IS019794, or ISO19794_COMPACT, it can have a value from 0 to the number of samples minus 1 in minTemplate2. If templateType2 is SG40o, this value is ignored.

# secuLevel

Security level (NoRMAL is recommended for most purposes)

LOWEST

LOWER

BELOW_NORMAL

NORMAL

ABOVE_NORMAL

HIGH

HIGHER

HIGHEST

# matched

Contains matching result. If the passed templates are the same, then true is returned. If not, false is returned.

# ·Return values

SGFPMError::ERROR_NONE= No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError:ERROR_INVALID_TEMPLATE1= Error in minTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in minTemplate2

# Int32 GetMatchingScore(Byte minTemplate1[], Byte minTemplate2[], Int32* score)

Gets matching score of two sets of minutiae data of the same template format

# . Parameters

# minTemplate1

A pointer to the buffer containing minutiae data extracted from a fingerprint image minTemplate2

A pointer to the buffer containing minutiae data extracted from a fingerprint image score

Matching score (from O to 199)

# Returned values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE1= Error in minTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in minTemplate2

Int32 GetMatchingScoreEx(Byte minTemplate1[], SGFPMTemplateFormat templateType1, Int32 sampleNum1, Byte minTemplate2[], SGFPMTemplateFormat templateType2, Int32 sampleNum2, Int32* score)

Gets matching score of two sets of minutiae data, which can be of different template formats (SG400, ANSI378, ISO19794,or ISO19794_COMPACT)

. Parameters

minTemplate1

A pointer to the bufer containing minutiae data extracted from a fingerprint image

templateType1

Specifies format of minTemplate1 (SG400, ANSI378, ISO19794, or ISO19794_COMPACT)

sampleNum1

Position of a sample to be matched in minTemplate1. If templateType1 is ANSl378, IS019794, or ISO19794_COMPACT, it can have a value from O to the number of samples minus 1 in minTemplate1. If templateType1 is SG400, this value is ignored.

minTemplate2

A pointer to the bufer containing minutiae data extracted from a fingerprint image

templateType2

Specifies format of minTemplate2 (SG400, ANSl378, ISO19794,or ISO19794_COMPACT)

sampleNum2

Position of a sample to be matched in minTemplate2. If templateType2 is ANSl378, IS019794, or ISO19794_COMPACT, it can have a value from O to the number of samples minus 1 in minTemplate2. If templateType2 is SG400, this value is ignored.

score

Matching score (from O to 199)

Returned values

SGFPMError::ERROR_NONE= No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in minTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in minTemplate2

# 3.1.2.5. Functions for ANSl378 Templates

Int32 GetTemplateSizeAfterMerge(Byte ansiTemplate1[], Byte ansiTemplate2[], Int32* size)

Calculates template size if two templates -ansiTemplate1 and ansiTemplate2-are merged.Use this function to determine the exact buffer size before using MergeAnsiTemplate().

Parameters

ansiTemplate1

A pointer to the buffer containing minutiae data. A template can have more than one sample. siTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample. e

Template size if two templates are merged

Return values

SGFPMError:ERROR NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in ansiTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2 = Error in ansiTemplate2

# Int32 MergeAnsiTemplate(Byte ansiTemplate1[], Byte ansiTemplate2[], Byte outTemplate[l)

Merges two ANSl378 templates and returns a new merged template.The size of the merged template (outTemplate) will be smaler than sum of te sizes of the two input templates (size of ansiTemplate1 + size of ansiTemplate2). Call GetTemplateSizeAfterMerge() to determine the exact buffer size for outTemplate before calling MergeAnsiTemplate().

# . Parameters

# ansiTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# asniTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# outTemplate

The buffer containing merged data. The buffer should be assigned by the application. To determine the exact bufer size, call GetTemplateSizeAfterMerge().

# Return values

SGFPMError:ERROR NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError:ERROR_INVALID_TEMPLATE1= Error in ansiTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in ansiTemplate2

# Int32 MergeMultipleAnsiTemplate(Byte inTemplates[], Int32 nTemplates, Byte outTemplate[])

Merges multiple ANSl378 templates and returns a new merged template.The size of the merged template (outTemplate) willbe smaler than the sum of the sizes of al templates in inTemplates.

# . Parameters

# inTemplates

A series of ANSl378 templates [ANSITemplate-1, ANSITemplate-2, ANSITemplate-.,..

ANSITemplate-n]

# nTemplates

The number of templates in inTemplates

# outTemplate

The bufer containing newly merged template data. The buffer should be assigned by the application.

# Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

# Int32 GetAnsiTemplatelnfo(Byte ansiTemplate[], SGFPMANSITemplatelnfo* templatelnfo)

Gets information of an ANSl378 template. Callthis function before MatchAnsiTemplate() to obtain information about a template.

# . Parameters

# ansiTemplate

ANSI378 template

# templatelnfo

Thebuferthatcontainstemplateinformation.Formoreinformationsee

SGFPMANSITemplatelnfo structure.

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter

SGFPMEror:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

# Int32 MatchAnsiTemplate(Byte ansiTemplate1[], Int32 sampleNum1, Byte ansiTemplate2[], Int32 sampleNum2, SGFPMSecurityLevel secuLevel, bool* matched)

Compares two sets of ANSl378 templates.It returns true or false as a matching result (matched). The security level (secuLevel) will affect matching result and may be adjusted according to the security policy required by the user or organization.

# . Parameters

# ansiTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in ansiTemplate1.It can be from O to the number of samples minus 1 in ansiTemplate1.

# ansiTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in ansiTemplate2.It can be from 0 to the number of samples minus 1 in ansiTemplate2.

# secuLevel

Security level (NORMAL is recommended for most purposes)

LOWEST

LOWER

LOW

BELOW_NORMAL

NORMAL

ABOVE_NORMAL

HIGH

HIGHER

HIGHEST

# matched

Contains matching result. If the passed templates are the same, then true is returned. If not, false is returned.

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Eror in ansiTemplate1

SGFPMError::ERROR_INVALID_TEMPLATE2= Eror in ansiTemplate2

# Int32 GetAnsiMatchingScore(Byte ansiTemplate1[], Int32 sampleNum1, Byte ansiTemplate2[], Int32 sampleNum2, Int32* score)

Gets matching score

# . Parameters

# ansiTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in ansiTemplate1. It can be from O to the number of samples minus 1 in ansiTemplate1.

# ansiTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in ansiTemplate2.It can be from O to the number of samples minus 1 in ansiTemplate2.

# score

Matching score (from O to 199)

# Return values

SGFPMError::ERROR_NONE = No error

SGFPMEror:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFPMError:ERROR_INVALID_TEMPLATE1= Error in ansiTemplate1

SGFPMError.ERROR_INVALID_TEMPLATE2= Error in ansiTemplate2

# 3.1.2.6. Functions for ISO19794 Templates

# Int32 GetlsoTemplateSizeAfterMerge(Byte isoTemplate1[], Byte isoTemplate2[], Int32* size)

Calculates template size if two templates - isoTemplate1 and isoTemplate2 - are merged. Use this function to determine the exact buffer size before using MergelsoTemplate().

# Parameters isoTemplate

A pointer to the buffer containing minutiae data.A template can have more than one sample.

# isoTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample.

# size

Template size if two templates are merged

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError:ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# Int32 MergelsoTemplate(Byte isoTemplate1[], Byte isoTemplate2[], Byte outTemplate[])

Merges two ISO19794 templates and returns a new merged template.The size of the merged template (outTemplate） wil be smaller than the sum of the sizes of the two input templates (size of ansiTemplate1 + size ofansiTemplate2). Cal GetlsoTemplateSizeAfterMerge() to determine the exact buffer size for outTemplate before caling MergelsoTemplate().

# Parameters

# isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# outTemplate

The buffer containing merged data. The bufer should be assigned by the application. To determine the exact bufer size,call GetlsoTemplateSizeAfterMerge().

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# Int32 MergeMultiplelsoTemplate(Byte inTemplates[], Int32 nTemplates, Byte outTemplate[])

Merges multiple ISO19794 templates and returns a new merged template.The size of the merged template (outTemplate) willbe smaller than te sum of the sizes of al templates in inTemplates.

# . Parameters

# inTemplates

A series of ISO19794 templates [ISOTemplate-1, ISOTemplate-2, ISOTemplate-3,

# ISOTemplate-n]

# nTemplates

The number of templates in inTemplates

# outTemplate

The buffer containing newly merged template data. The bufer should be assigned by the application.

# Return values

SGFPMError:ERROR NONE = No error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter

SGFPMEror:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

# Int32 GetlsoTemplatelnfo(Byte isoTemplate[], SGFPMANSITemplatelnfo* templatelnfo)

Gets information of an ISO19794 template. Call this function before MatchlsoTemplate() to obtain information about a template.

# . Parameters

# isoTemplate

ISO19794 template

# templatelnfo

The_buffer_thatcontainstemplateinformation.Formoreinformation，see SGFPMANSITemplatelnfo structure.

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError::ERROR_INVALID_PARAM = Invalid parameter

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

# Int32 MatchlsoTemplate(Byte isoTemplate1[], Int32 sampleNum1, Byte isoTemplate2[], Int32 sampleNum2, SGFPMSecurityLevel secuLevel, bool* matched)

Compares two sets of ISO19794 templates. It returns true or false as a matching result (matched). The security level (secuLevel) will affect matching result and may be adjusted according to the security policy required by the user or organization.

# . Parameters

# isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in isoTemplate1. It can be from O to the number of samples minus 1 in isoTemplate1.

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in isoTemplate2. It can be from O to the number of samples minus 1in isoTemplate2.

# secuLevel

Security level (NORMAL is recommended for most purposes)

LOWEST

LOWER

LOW

BELOW NORMAL

NORMAL

ABOVE_NORMAL

HIGH

HIGHER

HIGHEST

# matched

Contains matching result. If the passed templates are the same, then true is returned. If not, false is returned.

# . Return values

SGFPMError::ERROR NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError::ERROR_INVALID_TEMPLATE2 = Error in isoTemplate2

# Int32 GetlsoMatchingScore(Byte isoTemplate1[], Int32 sampleNum1, Byte isoTemplate2[], Int32 sampleNum2, Int32* score)

Gets matching score

# . Parameters

# isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in isoTemplate1. It can be from O to the number of samples minus 1 in isoTemplate1.

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in isoTemplate2.It can be from O to the number of samples minus 1 in isoTemplate2.

# score

Matching score (from O to 199)

# . Return values

SGFPMError::ERROR NONE = No error

SGFPMEror:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFPMError:ERROR INVALID TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR INVALID TEMPLATE2= Error in isoTemplate2

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# 3.1.2.7. Functions for ISO19794 Compact Card Templates

# Int32 GetlsoCompactTemplateSizeAfterMerge(Byte isoTemplate1[], Byte isoTemplate2[], Int32* size)

Calculates template size if two templates - isoTemplate1 and isoTemplate2- are merged. Use this function to determine the exact buffer size before using MergelsoCompactTemplate().

# . Parameters

# isoTemplate1

A pointer to the bufer containing minutiae data.A template can have more than one sample.

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# size

Template size if two templates are merged

# . Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# Int32 MergelsoCompactTemplate(Byte isoTemplate1[], Byte isoTemplate2[], Byte outTemplate[])

Merges two ISO19794 compact card templates and returns a new merged template. The size of the merged template (outTemplate) will be smaller than the sum of the sizes of the two input templates (size of ansiTemplate1 + size of ansiTemplate2). Call GetlsoCompactTemplateSizeAfterMerge() to determine the exact buffer size for outTemplate before caling MergelsoCompactTemplate().

# . Parameters

# isoTemplate1

A pointer to the buffer containing minutiae data.A template can have more than one sample.

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# outTemplate

The buffer containing merged data. The bufer should be assigned by the application.To determine the exact bufer size, call GetlsoCompactTemplateSizeAfterMerge().

# Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMEror:ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# Int32 MergeMultiplelsoCompactTemplate(Byte inTemplates[], Int32 nTemplates, ByteoutTemplate[])

Merges multiple ISO19794 compact card templates and returns a new merged template. The size of the merged template (outTemplate) will be smaler than the sum of the sizes of all templates in inTemplates.

# Parameters

# inTemplates

A series of ISO19794 compact card templates [ISOTemplate-1, ISOTemplate-2,

ISOTemplate-3,.. ISOTemplate-n]

# nTemplates

The number of templates in inTemplates

# outTemplate

The buffer containing newly merged template data. The bufer should be assigned by the application.

# Return values

SGFPMError::ERROR_NONE = No error

SGFPMError::ERROR_INVALID_PARAM = Invalid parameter

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

# Int32 GetlsoCompactTemplatelnfo(Byte isoTemplate[], SGFPMANSITemplatelnfo* templatelnfo)

Getsinformation of an ISO19794 compact card template. Call this function before MatchlsoCompactTemplate() to obtain information about a template.

# . Parameters

# isoTemplate

ISO19794 compact card template

# templatelnfo

Thebufferthatcontainstemplateinformation.Formoreinformation，see

SGFPMANSITemplatelnfo structure.

# Return values

SGFPMError:ERROR NONE = No error

SGFPMError:ERROR_INVALID_PARAM = Invalid parameter

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

# Int32 MatchlsoCompactTemplate(Byte isoTemplate1[], Int32 sampleNum1, Byte isoTemplate2[], Int32 sampleNum2, SGFPMSecurityLevel secuLevel, bool* matched)

Compares two sets of ISO19794 compact card templates. It returns true or false as a matching result (matched). The security level (secuLevel) will affect matching result and may be adjusted according to the security policy required by the user or organization.

# . Parameters

# isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in isoTemplate1. It can be from O to the number of samples minus 1 in isoTemplate1.

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in isoTemplate2.It can be from O to the number of samples minus 1 in isoTemplate2.

# secuLevel

Security level (NoRMAL is recommended for most purposes)

LOWEST

LOWER

LOW

BELOW_NORMAL

NORMAL

ABOVE_NORMAL

HIGH

HIGHER

HIGHEST

# matched

Contains matching result. If the passed templates are the same, then true is returned. If not, false is returned.

# Return values

SGFPMError:ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# Int32 GetlsoCompactMatchingScore(Byte isoTemplate1[], Int32 sampleNum1, Byte isoTemplate2[], Int32 sampleNum2, Int32* score)

Gets matching score

# . Parameters

# isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in isoTemplate1. It can be from O to the number of samples minus 1 in isoTemplate1.

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in isoTemplate2.It can be from O to the number of samples minus 1 in isoTemplate2.

score

Matching score (from 0 to 199)

Return values

SGFPMError::ERROR_NONE = No error

SGFPMError:ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFPMError::ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFPMError:ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

SGFPMError::ERROR_INVALID_TEMPLATE1= Eror in isoTemplate1

SGFPMError::ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# 3.1.2.8. Other

# Int32 GetMinexVersion(lnt32 *extractor, Int32* matcher))

Gets algorithm version used in this SDK

. Parameters

extractor

MINEX compliant extractor version number

matcher

MINEX compliant matcher version number

Return values

SGFPMError:ERROR_NONE = No error

# 3.1.3. Property

# Property NumberOfDevice

Description

Contains number of devices after calling EnumerateDevice()

# 3.2. SGFPMDevicelnfoParam Structure

```txt
public struct SGFPMDevicesInfoParam { Int32 DeviceID; Byte DeviceSN[]; Int32 ComPort; Int32 ComSpeed; Int32 ImageWidth; Int32 ImageHeight; Int32 Contrast; Int32 Brightness; Int32 Gain; Int32 ImageDPI; Int32 FWVersion; }; 
```

# Description

SGFPMDevicelnfoParam is used to obtain device information when caling GetDevicelnfo()

# Constructor

SGFPMDevicelnfoParam()

# Members

```txt
DeviceID Contains device ID for USB readers only (0 -9)  
DeviceSN Contains device serial number for USB readers  
ComPort Contains Device ID for USB readers  
ComSpeed Communication speed (not used in this version)  
ImageWidth Fingerprint image width in pixels  
ImageHeight Fingerprint image height in pixels  
Brightness Current Brightness value (0-100)  
Contrast Current Contrast value (0-100)  
Gain Amplification (1, 2, 4, or 8) of image brightness (higher value yields darker image)  
ImageDPI Image resolution of the reader in DPI  
FWVersion Device firmware version number for USB readers 
```

# 3.3. SGFPMDevicelnfo Structure

```java
public class SGFPMDevicesInfo { public char[] ID; public char[] Name; } 
```

# Description

Used to obtain the propereties of a U2O-ASF-BT (BLE) reader in GetDevicelnfoFound( after caling FindDevices()

# Constructor

SGFPMDeviceList()

# Members

```txt
ID Contains U20-ASF-BT (BLE) device ID DevName Contains device name 
```

# 3.4. SGFPMDeviceList Structure

```objectivec
Public struct SGFPMDevicesList
{
    SGFPMDevicesName DevName;
    Int32 DevID;
    Int16 DevType;
    Byte DevSN[ ]; 
```

# Description

Used to obtain a list of currently attached reader(s) in GetEnumDevicelnfo() after caing EnumerateDevice()

# Constructor

SGFPMDeviceList()

# Members

```txt
DevName Contains device name (SG_DEV_FDU02, SG_DEV_FDU03, SG_DEV_FDU04, SG_DEV_FDU05, SG_DEV_FDU06, SG_DEV_FDU06AP, SG_DEV_FDU07, SG_DEV_FDU08, SG_DEV_FDU08A, SG_DEV_FDU08AL, SG_DEV_FDU09A, SG_DEV_FDU10A, SG_DEV_FDUSDA, SG_DEV_FDUSDA_BLE) DevID Contains USB device ID if the device type is USB DevType Not used DeviceSN Contains device serial number of USB readers. Length is defined in DEV_SN_LEN(15) 
```

# 3.5.SGFPMFingerlnfo Structure

```txt
public struct SGFPMFingerInfo  
{ SGFPMFingerPosition FingerNumber; Int16 ViewNumber; Int16 ImpressionType; Int16 ImageQuality; }; 
```

# Description

Used when_calling CreateTemplate(). The provided information will be put into the template. For ANSI378, ISO19794-2, and ISO19794-2 Compact templates,this information can be seen from the template structure format. For SG400 templates, this information cannot be seen in the template.

# Constructor

SGFPMFingerInfo();

# Members

# FingerNumber

```txt
Finger position number Finger  
FINGPOS_UK (0x00): Unknown finger  
FINGPOS_RT (0x01): Right thumb  
FINGPOS_RI (0x02): Right index finger  
FINGPOS_RM (0x03): Right middle finger  
FINGPOS_RR (0x04): Right ring finger  
FINGPOS_RL (0x05): Right little finger  
FINGPOS_LT (0x06): Left thumb  
FINGPOS_LI (0x07): Left index finger  
FINGPOS_LM (0x08): Left middle finger  
FINGPOS_LR (0x09): Left ring finger  
FINGPOS_LL (0x0A): Left little finger 
```

# ViewNumber

Sample number for each finger (starts at 0)

# ImpressionType

Impression type (should be O for SecuGen readers)

```txt
IMPTYPE_LP (0x00): Live-scan plain  
IMPTYPE_LR (0x01): Live-scan rolled  
IMPTYPE_NP (0x02): Non-live-scan plain  
IMPTYPE_NR (0x03): Non-live-scan rolled 
```

# ImageQuality

Image quality value (0- 100).To obtain image quality, use GetlmageQuality().

# 3.6. SGFPMANSITemplatelnfo Structure

```c
public_struct SGFPMANSITemplateInfo { Int32 TotalSamples; SGFPFingerInfo* SampleInfo[]; }; 
```

# Description

Used when caling GetAnsiTemplatelnfo (). The provided information will be put into the template. For ANSI378, ISO19794-2, and ISO19794-2 Compact templates,this information can be seen from the template structure format. For SG400 templates, this information cannot be seen in the template.

# Constructor

SGFPMANSITemplatelnfo();

# Members

# TotalSamples

Indicates the number of samples in a template. One template can have a maximum of 225 samples.

Number of samples = Max finger number 15 * Max View Number 15 = 225

# Samplelnfo

Information of each sample in a template. Refer to section 3.4 SGFPMFingerInfo Structure.

# 3.7. SGFPMDeviceName Enumeration

![](images/45c25cd8859628626746420d2e5ea79f9b5aab0b0ec374553ddb60778934b754.jpg)

# 3.8. SGFPMPortAddr Enumeration

![](images/0384c63e03c1afa4268478096bd9db87672a8c1726cb07139292e2d1ff208817.jpg)

# 3.9. SGFPMSecurityLevel Enumeration

![](images/e97e8dd59959a6d885a4318cbd1a134bfbf4d887f6d298e008ee44d66c6b29fe.jpg)

# 3.10. SGFPMTemplateFormat Enumeration

![](images/333abe6e78d8beff4b537ffe519da66ed66c3054c9f259af0599185b4245de55.jpg)

# 3.11.SGFPMError Enumeration

![](images/f1714a0b8b695658ecacaff39607bdaf8e81e039b81af54fa569baa96bdc9f6a.jpg)

![](images/2370ee7f26f6f9d7face00a35b69975cd9cc48e79168aba2614408e4551eb34a.jpg)

# 3.12. SGFPMAutoOnEvent Enumeration

![](images/8aeac8fea5a00ebcd57a6f10d709a43808644ac7d04d0ba592a24fdae8869d56.jpg)

# 3.13. SGFPMMessages Enumeration

![](images/519a7fd57443f5b094f65f24a30792126d1e8f953a7b9b35ed4d9934168049fb.jpg)

# 3.14. SGFPMlmpressionType Enumeration

![](images/2d3eb5bb8720dad928c55e77c1a5371ac6fd32a63e14ad1a1b284e6fbb3d75aa.jpg)

# 3.15.SGFPMFingerPosition Enumeration

![](images/a1c989538e0ba87a00e35956871240063e8511bc035214caacba726957566381.jpg)
