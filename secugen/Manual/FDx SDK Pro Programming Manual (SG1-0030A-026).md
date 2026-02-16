# SecuGen

# Programming Manual for FDx SDK Pro for Windows

For applications using SecuGen@ fingerprint readers

SG1-0030A-026 (Last updated: 05/30/2024)

Copyright @ 1998-2024 SecuGen Corporation. ALL RIGHTS RESERVED.Information in this document is subject to change without notice.The software described in this document is furnished under a license agreement or nondisclosureagreement.The software may be used only in accordance with the terms ofthe agreement.SecuGen, Auto-On,FDU02,FDU03,FDU04,SDU03,SDU04,U10,U20,U30,UPx, U-Air and U20-ASF-BT are trademarksor registered trademarks ofSecuGen Corporation.Allother brands or product names may be trademarks,service marks or registered trademarks of their respective owners.

# Contents

# CHAPTER 1. OVERVIEW...

1.1.FEATURES. 4   
1.2.SYSTEM REQUIREMENTS

# CHAPTER 2. FILES INCLUDED WITH THE SDK.. .5

2.1.INCLUDED FILES .5

# CHAPTER 3. PROGRAMMING IN C/C++ ..

3.1. CREATING SGFPM.   
3.2. INITIALIZING SGFPM.   
3.3.TERMINATING SGFPM 8   
3.4.OPENING THE SECUGEN FINGERPRINT READER .9   
3.5.GETTING DEVICE INFORMATION.. .9   
3.6.CAPTURING A FINGERPRINT IMAGE .10   
3.7.GETTING IMAGE QUALITY. .12   
3.8.CONTROLLING BRIGHTNESS .12  
3.9.CREATING A TEMPLATE .12  
3.10.MATCHING TEMPLATES .13   
3.11.REGISTRATION PROCESS .16   
3.12.VERIFICATION PROCESS .17   
3.13.GETTING MATCHING SCORE .17  
3.14.USING AUTO-ONTM .18   
3.15.TEMPLATEFORMAT .19   
3.16.MANIPULATING ANSI378 TEMPLATES .21   
3.17. MANIPULATING ISO19794-2 TEMPLATES. .23   
3.18. MANIPULATING ISO19794-2 COMPACT CARD TEMPLATES. .25   
3.19.GETTING VERSION INFORMATION OF MINEX COMPLIANT ALGORITHMS .28

# CHAPTER4.FUNCTIONREFERENCE. 29

4.1.SGFPM CREATION AND TERMINATION .29   
4.2.INITIALIZATION .29  
4.3.DEVICE AND CAPTURING FUNCTIONS. ..31   
4.4.EXTRACTION FUNCTIONS. .37   
4.5.MATCHING FUNCTIONS .39   
4.6.FUNCTIONS FOR ANSI378 TEMPLATES .41   
4.7. FUNCTIONS FOR ISO19794-2 TEMPLATES. .44   
4.8. FUNCTIONS FOR ISO19794-2 COMPACT CARD TEMPLATES .47   
4.9.OTHER . .49

# CHAPTER5. STRUCTURE REFERENCE. .50

5.1.SGDEVICEINFOPARAM. .50   
5.2. SGDEVICEINFO. ...51   
5.3.SGDEVICELIST. .51   
5.4. SGFINGERINFO.. .51   
5.5.SGANSITEMPLATEINFO/SGISOTEMPLATEINFO. .52

# CHAPTER 6. CONSTANTS .. .53

6.1.SGFDXDEVICENAME. .53   
6.2. SGPPPORTADDR. .53   
6.3.SGFDXSECURITYLEVEL .53   
6.4.SGFDXTEMPLATEFORMAT. .54   
6.5.SGIMPRESSIONTYPE .54   
6.6. SGFINGERPOSITION .54   
6.7.SGFDXERRORCODE .55   
6.8. OTHER CONSTANTS. .56

# APPENDIX A. USING SGFPM OBJECTS DIRECT.Y... ....57

A.1.CREATING AN SGFPM OBJECT. .57   
A.2. DESTROYING AN SGFPM OBJECT .57   
A.3.ACCESSING OTHER MEMBER FUNCTIONS .57

# APPENDIX B. USING .NET LIBRARY. .59

# APPENDIX C. GETTING A TEMPLATE FROM BLUETOOTH DEVICES (U20-ASF-BT....60

# Chapter 1. Overview

SecuGen's FDx SDK Pro is designed to provide low level access to SecuGen's fingerprint readers using SecuGen's next-generation algorithm module. Programming with SecuGen's FDx SDK Pro is simple and easy and gives the most development flexibility among al SecuGen SDKs.

# 1.1. Features

·SecuGen's new and improved next-generation algorithms   
·Highly flexible and easy to use for developers of all kinds of applications   
·Support for four kinds of fingerprint minutiae formats (also known as templates):

○SG400: SecuGen's proprietary fingerprint minutiae format   
ANSl378: Finger Minutiae Format for Data Exchange (ANSl-INCITS 378-2004)   
ISO19794-2: Finger Minutiae Data (ISO/IEC 19794-2:2005)   
ISO19794-2 Compact: Finger Minutiae Data-Compact Card Template (ISO/IEC 19794-2:2005 / Section 8.2 Compact Size Finger Minutiae Format)

·Low-level APls for image capture, feature extraction and matching

The following extraction and matching algorithms, which are incorporated in sgfpamx.d in this SDK, support the ANSl-INCITS 378-2004 standard and have been tested and proven to be MINEX Compliant (http://ingerprint.nist.gov/MINEX):

■SecuGen ANSI INCITS 378 Template Generator v3.5 (feature extraction algorithm)   
■SecuGen ANSI INCITS 378 Template Matcher v3.5 (matching algorithm)

# 1.2. System Requirements

SecuGen USB Fingerprint Readers_capture a fingerprint image and digitize the image to an 8-bit grayscale image at 5Oo DPl resolution.The host system then retrieves the image through its USB port for subsequent processing. All SecuGen USB readers, except for FDU01-based readers,are supported in this SDK.

SecuGen Bluetooth Fingerprint Readers capture a fingerprint image and digitize the image to an 8-bit gray-scale image at 500 DPl resolution. While the host system is capable of retrieving the image wirelessly for subsequent processing,it is recommended to process the image within the Bluetooth device before transmitting to the host. Refer to Appendix C. Getting_a Template from Bluetooth Devices for more information. All SecuGen Bluetooth readers are supported in this SDK.

# Windows System requirements

Intel Pentium Processor or faster

At least 64 MB RAM

At least 80 MB available hard disk space

For USB fingerprint readers only:

USB port (2.0 or higher)

Windows 11,10,8.1,8,7 /Vista /XP,Windows Server 2022,2019,2016 /2012/ 2008 R2

# For Bluetooth fingerprint readers only:

Bluetooth compatibility

Windows 10 or higher

# Chapter 2. Files Included with the SDK

# 2.1. Included Files

After unzipping the SDK, the following files are available to use.

# Bin\i386 directory

Runtime modules for 32-bit platform (same files that are copied to Windows system directory)

sgfplib.dll Main module

sgfpamx.dll Fingerprint algorithm module for extraction & matching (MINEX Compliant)

sgwsqlib.dll WSQ module

sgfdusda.dll Module for U20-ASF-BT devices (Bluetooth SPP and BLE)

sgbledev.dll Module for U20-ASF-BT devices (Bluetooth BLE only)

# Binlx64 directory

Runtime modules for 64-bit platform

sgfplib.dll Main module

sgfpamx.dll Fingerprint algorithm module for extraction & matching (MINEX Compliant)

sgwsqlib.dll WSQ module

sgfdusdax64.dllModule for U20-ASF-BT devices (Bluetooth SPP and BLE)

sgbledev.dll Module for U20-ASF-BT devices (Bluetooth BLE only)

# Inc directory

SDK library header file

sgfplib.h Declarations of function prototypes and structures used in the SDK

# Lib\i386 directory

SecuGen Fingerprint Module library for 32-bit platforms

sgfplib.lib Fingerprint Module import library

# Liblx64 directory

SecuGen Fingerprint Module library for 64-bit platforms

sgfplib.lib Fingerprint Module import library

# Samples directory

Visual C++ Sample Source Code

Device Test Sample code for image capture

Matching Sample code for template matching SecuGen proprietary templates

MatchingANSI Sample code for matching ANSl378 templates

MatchingISO Sample code for matching ISO19794-2 templates

MatchingUAIR Sample code for image capture from contactless device, U-Air

# .NET and .NET Framework

DotNet\Bin\i386 and DotNet\Bin\x64 directories

SecuGen.FDxSDKPro.DotNet.Windows.dll

.NET assembly file wrapping sgfplib.dll (Note: x64 .NET dll must be used for x64 platforms)

DotNet\Samples directory

Sample code using SecuGen.FDxSDKPro.DotNet.Windows.dll

Matching sample written in C#

Matching/capture sample for contactless device, U-Air in C#

DotNetFramework\Bin\i386 and DotNet\Bin\x64 directories

SecuGen.FDxSDKPro.Windows.dll

.NET assembly file wrapping sgfplib.dll. (Note: x64 .NET dl must be used for x64 platforms)

DotNetFrameworklSamples directory

Sample code using SecuGen.FDxSDKPro.Windows.dll

Matching sample written in C#

Matching sample showing ANSl378 template usage written in C#

Matching/capture sample for contactless device, U-Air in C#

Matching sample written in Visual Basic .NET

# Chapter 3. Programming in C/C++

SecuGen's FDx SDK Pro was designed for ease in programming and the most flexibility for developers. Al SDK functions are integrated into the SGFPM (SecuGen FingerPrint Module) class. The SGFPM class includes deviceinitialization,fingerprint capture,minutiae extraction and matching functions.The developer can access SDK functions directly through the SGFPM class or through C functions that wrap the SGFPM class.C functions provide access to SDK functionalities through an SGFPM handle.In this chapter, C functions are explained. For direct access to the SGFPM class, refer to AppendixA.

# 3.1. Creating SGFPM

To use SGFPM,call SGFPM_Create(), which creates an SGFPM object and returns a handle to the SGFPM object.When calling SGFPM_Create()， pass a pointer to the handle to contain the SGFPM handle as a parameter. The SGFPM handle is used for the duration of the session to access other functions.

```sql
HSGFPM m_hFpm; // handle for SGFPM  
DWORD err = SGFPM_Create(&m_hFpm); 
```

# 3.2. Initializing SGFPM

If an SGFPM object is created，it should be initialized using SGFPM_Init() or SGFPM_InitEx2(). SGFPM_Init() takes the device name,loads the driver that corresponds to the device name and initializes thefingerprint algorithm module based on device information. SGFPM_InitEx2() takes image width, image height,resolution and path to alicense file as parameters. CallSGFPM_InitEx2() when using the fingerprint algorithm module without a SecuGen reader.

The table below summarizes the correlation among device name (device type), loaded device driver and initial image size when the Init(SGFPMDeviceName devName) function is called.

Device Name, Device Driver and Image Size   
![](images/f2554fc199adcb0e4650810ab90e099fe3cb1fd7332e2736f58c14082d26a13c.jpg)

# · SGFPM_Init()

```txt
DWORD devname = SG_DEV_AUTO;  
err = SGFPM_Init(m_hFPM, devname); 
```

# SGFPM_InitEx2()

```c
DWORD image_width = 300;  
DWORD image_height = 400;  
DOWRD image_dpi = 500;  
char* path_tolicense_file;  
err = SGFPM_InitEx2(m_hFPM, image_width, image_height, image_dpi, path_tolicense_file);  
(* SGFPM_InitEx() is no longer supported. It returns the error message: SGFDX_ERROR_NO LongerSupported.) 
```

# 3.3.Terminating SGFPM

SGFPM_Terminate() must be called prior to terminating the application. It frees up the memory used by the SGFPM object.

```c
if (m_hFPM)  
{ SGFPM_Terminate(m_hFPM); } m_hFPM = 0; 
```

# 3.4. Opening the SecuGen Fingerprint Reader

To use a SecuGen fingerprint reader，call SGFPM_OpenDevice().The second parameter (devld) of SGFPM_OpenDevice() can have diferent meanings depending on which type offingerprint reader is used.

For USB readers,devld means device ID. If only one USBfingerprint reader is connected to the PC,devld will be O. If multiple USB fingerprint readers are connected to one PC, devld can range from O to 9.The maximum number of SecuGen USB readers that can be connected to one PC is 10.

If devld is O (AUTO_DETECT),the device driver willfind the port address automatically.The port address is defined in sgfplib.h.

In general,if only one USB reader is connected to the PC，then O or USB_AUTO_DETECT1 is recommended.

```cpp
DWORD devId = USB_AUTO_DETECT; // auto detect  
err = SGFPM_OpenDevice(m_hFPM, devId); 
```

For U20-ASF-BT (BLE) devices (SG_DEV_FDUSDA_BLE)， SGFPM_OpenDevice2() should be called with a device name from SGFPM_FindDevices() or in wide character string format2 Instead.

```txt
DWORD ndevs = 0;  
SGDeviceInfo *devList = NULL;  
FindDevices(m_hFPM, &ndevs, &devList); // calls SGFPM_FindDevices()  
if (ndevs > 0) {  
    err = SGFPM_OpenDevice2(m_hFPM, devList[0].ID);  
} else {  
    err = SGFDX_ERROR_DEVICE_NOT_found;  
} 
```

# 3.5. Getting Device Information

Device information can be retrieved by caling SGFPM_GetDevicelnfo(), which obtains required device information such as image height and width. The device information is contained inthe SGDevicelnfoParam structure. Refer to Chapter 5. Structure Reference for a detailed description of the SGDevicelnfoParam structure.

SGDeviceInfoParam device_info;   
memset(&device_info,0x00,sizeof(device_info));   
error $=$ SGFPM_GetDeviceInfo(m_hFPM，&device_info);   
if (error $= =$ SGSGFDX_ERROR_NONE)   
{ mDevID $\equiv$ device_info.DeviceID; mDevSN $\equiv$ device_info.DeviceSN; m_ImgWidth $\equiv$ device_info.ImageWidth; m_ImgHeight $\equiv$ device_info.ImageHeight; m_Contrast $\equiv$ device_info.Contrast;

```txt
m_Brightness = device_info.Brightness;  
m_Gain = device_info.Gain;  
m_PhotoDPI = device_info.ImageDPI;  
char buffer[20];  
_ultoa(device_info.FWVersion, buffer, 16);  
m_FWVersion = CString(buffer); 
```

For U20-ASF-BT (BLE) devices, SGFPM_FindDevices() can be used to enumerate them.

```c
DWORD ndevs = 0;  
SGDeviceInfo *devList = NULL;  
int timeout = 40000; // 40 seconds  
// finding devices for timeout in milliseconds or less  
DWORD err = SGFPM_FindDevices(m_hFPM, &ndevs, &devList, timeout); 
```

To cancelfinding U20-ASF-BT (BLE) devices, SGFPM_CancelFind() can be caled in the other thread.

# 3.6. Capturing a Fingerprint Image

After the reader is initialized,a fingerprint image can be captured.The SGFPMobject provides three types of fingerprint image capture functions listed below. Captured fingerprints are 256 gray-level images,and image width and height can be retrieved by caling SGFPM_GetDevicelnfo().The image buffer should be allocated by the calling application.

SGFPM_Getlmage() captures an image without checking for the presence of a finger or checking image quality. SGFPM_GetlmageEx() captures fingerprint images continuously, checks the image quality against a specified quality value and ignores the image if it does not contain a fingerprint or if the quality of the fingerprint is not acceptable. If a quality image is captured within the given time (the second parameter), SGFPM_GetlmageEx() ends its processing.If a window handle is provided by the application,the drivers will draw a fingerprint image in the provided window using the handle value. For more information about each of the following SGFPM image capture functions, refer to Chapter 4.Function Reference.

If SGFPM_Getimage() needstobe called multiple times， it isrecommended tocall SGFPM_BeginGetlmage() before and SGFPM_EndGetlmage() after the series of calsfor SGFPM_Getlmage().This willallow SGFPM_Getlmage() to run faster if the device,such as U-Air, supports these two functions. For more information, please review the MatchingUAlR sample code.

·SGFPM_Getlmage()

```txt
[Example]  
BYTE *buffer = new BYTE(m/ImageWidth*m/ImageHeight);  
if (SGFPM_GetImage(m_hFPM, buffer) == SGSGFDX_ERROR_NONE) // Get image data from device  
{ // Display image // Process image  
}  
delete [] buffer; 
```

# ·SGFPM_GetlmageEx()

```objectivec
DWORD timeout = 10000;  
DWORD quality = 80;  
if (SGFPM_GetImageEx(m_hFPM, buffer, timeout, NULL, quality) == SGFDX_ERROR_NONE) { // Draw image 
```

For U20-ASF-BT (BLE） devices，SGFPM_CreateTemplateDev() and SGFPM_GetTemplateDev() are recommended because transferring images wirelessy can take a long time, which may not be practical.

```c
// capture and create a template  
DWORD template_size = 0;  
dwErr = SGFPM_CreateTemplateDev(hFPM, &template_size);  
assert(dwErr == SGFDX_ERROR_NONE);  
assert/template_size > 0);  
// get template data  
if (template_size > 0) {  
    char *template_data = new char[template_size];  
    dwErr = SGFPM_GetTemplateDev(hFPM, (BYTE*) template_data);  
    assert(dwErr == SGFDX_ERROR_NONE);  
    delete[] template_data; 
```

The_templateformatcan_be_retrievedfromaU20-ASF-BT_(BLE) device_bycaling SGFPM_GetTemplateFormatDev(). The format can be set by caling SGFPM_SetTemplateFormatDev(). These work only with SGFPM_CreateTemplateDev().

// get the current template format   
WORD current_template_format $\equiv$ 0;   
dwErr $=$ SGFPM_GetTemplateFormatDev(hFPM, &current_template_format); assert(dwErr $\equiv$ SGFDX_ERROR_NONE);   
// set template   
WORD template_format $\equiv$ format;   
dwErr $=$ SGFPM_SetTemplateFormatDev(hFPM, template_format); assert(dwErr $\equiv$ SGFDX_ERROR_NONE);

# 3.7. Getting Image Quality

To determine the fingerprint image quality, use SGFPM_GetlmageQuality(). For a simple and fast way to determine the quality of the last image captured from the device, use SGFPM_GetLastimageQuality()3.

·SGFPM_GetlmageQuality()

```c
DWORD img_qlty;  
SGFPM_GetImageQuality(hFPM, ImageWidth, m/ImageHeight, fp_image, &mg_qlty);  
if (img_qlty < 80)  
// Capture again 
```

# 3.8. Controlling Brightness

Depending on thefingerprint reader used,environmental factors and the specifications of the host system, the brightness of a fingerprint image may vary. To improve the quality of a captured image,the image brightness should be adjusted by changing the brightness seting of the reader using SGFPM_Configure() or SGFPM_SetBrightness(). Using SGFPM_Configure() presents a built-in dialog box in the driver from which the user can easily adjust brightness and receive instant feedback from the fingerprint image displayed. SGFPM_SetBrightness() can also be used to control brightness of the reader. Brightness default values vary among the different types of SecuGen readers.

· SGFPM_Configure()

```txt
HWND hwnd = 0;  
SGFPM_SetBrightness(m_hFPM, hwnd); // Show device configuration box in the driver. 
```

· SGFPM_ SetBrightness()

```txt
SGFPM_SetBrightness(m_hFPM, 70); // Set from 0 to 100. 
```

# 3.9. Creating a Template

To register or verify a fingerprint, a fingerprint image is first captured,and then feature data (minutiae) is extracted from the image into a template. Minutiae are the unique core points near the center of every fingerprint, such as ridges,ridge endings,bifurcations, valleys and whorls.

Use SGFPM_CreateTemplate() to extract minutiae from a fingerprint image to form a template.The buffer shouldbe assigned by the application. To get the bufer size of the minutiae， call SGFPM_GetMaxTemplateSize().It willreturn the maximum bufer size fordata in one template.The actual template size can be obtained by calling SGFPM_GetTemplateSize() after the template is created.The SGFPM_CreateTemplate() APl creates only one set of data from an image.

Note: Templates having the ANSl378, ISO19794-2,or ISO19794-2 compact card formats may be merged. For more information about template formats and merging formats,refer to the following Sections: Section 3.15. Template Format Section 3.16. Manipulating ANSl378 Templates

Section 3.17. Manipulating ISO19794-2 Templates

Section 3.18. Manipulating ISO19794-2 Compact Card Templates

# · SGFPM_CreateTemplate()

```objectivec
// Get a fingerprint image  
DWORD qlty = 80;  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, qlty);  
// Create template from captured image  
BYTE* minBuffer;  
err = SGFPM_GetMaxTemplateSize(m_hFPM, &maxTemplateSize);  
minBuffer = new BYTE[maxTemplateSize];  
// Set information about template  
SGFingerInfo finger_info;  
finger_info.FingerNumber = GetFingerPos();  
finger_info.ImageQuality = (WORD)qlty;  
finger_info.ImpressionType = SG_IMPTYPE_LP;  
finger_info.ViewNumber = 0;  
err = SGFPM_CreateTemplate(m_hFPM, &finger_info, m_ImgBuf, minBuffer); 
```

# 3.10. Matching Templates

Templates are matched during both registration and verification processes. During registration，it is recommended to capture at least two image samples per fingerprint for a higher degree of accuracy.The minutiae data from each image sample can then be compared against each other (i.e. matched) to confirm the quality of the registered fingerprints.This comparison is analogous to a password confirmation routine that is commonly required for entering a new password.

During verification, newly input minutiae data is compared against registered minutiae data. Similar to the registration process, verification requires the capture of a fingerprint image followed by extraction of the minutiae data from the captured image into a template.

To match templates, FDx SDK Pro provides four kinds of matching functions. Each function requires two sets of template data for matching.

SGFPM_MatchTemplate():This function matches templates having the same format as the default format. When caling this function,each template should include only one sample (or view) per template.The default formatis_SG400_(SecuGenproprietaryformat)butcanbechangedbycalling SGFPM_SetTemplateFormat().For more information about template formats，refer to Section_3.15. Template Format.

SGFPM_MatchTemplateEx(): This function can match templates having diferent template formats. This function can also specify the template formatfor each template and can match templates that have multiple views per template.

SGFPM_MatchAnsiTemplate(): This function is the same as SGFPM_MatchTemplateEx() except that it supports only ANSl378 templates.

SGFPM_MatchlsoTemplate(): This function is the same as SGFPM_MatchTemplateEx() except that it

supports only ISO19794-2 templates.

SGFPM_MatchlsoCompactTemplate(): This function is the same as SGFPM_MatchTemplateEx() except that it supports only ISO19794-2 compact card templates.

![](images/36a0094ccb4b28da8d82be2eaa0fde39aeae6624117d63ed887b248e549429e8.jpg)

# ·SGFPM_MatchTemplate()

```txt
BYTE* m_RegTemplate1;  
BYTE* m_RegTemplate2;  
...  
// Getfirst fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, qlty);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_RegTemplate1);  
// Get second fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, qlty);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_RegTemplate2);  
DWORD sl = SL_NORMAL; // Set security level as NORMAL  
BOOL matched;  
err = SGFPM MatchesTemplate(m_hFPM, m_RegTemplate1, m_RegTemplate2, sl, &matched); 
```

# ·SGFPM_MatchTemplateEx()

```c
BYTE* m_RegTemplate1; // Will contain SG400 template  
BYTE* m_RegTemplate2; // Will contain ANSI378 template  
// Make SG400 template  
err = SGFPM_SetTemplateFormat(m_hFPM, TEMPLATE_FORMAT_SG400);  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, qlty);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_RegTemplate1);  
// Make ANSI378 template  
err = SGFPM_SetTemplateFormat(m_hFPM, TEMPLATE_FORMAT_ANSI378);  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, qlty);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_RegTemplate2);  
DWORD sl = SL_NORMAL; // Set security level as NORMAL  
BOOL matched;  
err = SGFPM_MatchTemplateEx(m_hFPM, m_RegTemplate1, 
TEMPLATE_FORMAT_SG400, 
0, // Must be 0 if template format is SG400 
m_RegTemplate2, 
TEMPLATE_format_ANSI378, 
```

```javascript
0, // Currently only one samplesl, &matched); 
```

# ·SGFPM_MatchAnsiTemplate()

DWORD err;   
BOOL matched $=$ FALSE;   
SGANSITemplateInfo sample_info;   
err $=$ SGFPM_GetAnsiTemplateInfo(m_hFPM, m_EnrollTemplate, &sample_info);   
matched $=$ TRUE;   
bool finger_found $=$ false;   
for (int i = 0; i < sample_info.TotalSamples; i++)   
{ if(sample_info SampleInfo[i].FingerNumber $= =$ finger_pos) // Try match for same finger. { finger_found $=$ true; err $=$ SGFPM MatchAnsiTemplate(m_hFPM, m_EnrollTemplate, i, m_FetBufM, 0, SecurityLevel[m_SecureLevel.GetCurSel(), &matched); if (!matched) break; }

# · SGFPM_MatchlsoTemplate()

DWORD err;   
BOOL matched $=$ FALSE;   
// ISO19794-2 SGISOTemplateInfo sample_info $\equiv$ {0}; err $=$ SGFPM_GetIsoTemplateInfo(m_hFPM, m_StoredTemplate, &sample_info); matched $=$ FALSE; int found_finger $= -1$ for (int i $= 0$ ; i $<$ sample_info.TotalSamples; i++) { // ISO19794-2 err $=$ SGFPM MatchIsoTemplate(m_hFPM, m_StoredTemplate, i, m_FetBufM, 0, SL_NORMAL, &matched); if (matched) { found_finger $=$ sample_info SampleInfo[i].FingerNumber; break; }

# ·SGFPM_MatchlsoCompactTemplate()

DWORD err;   
BOOL matched $=$ FALSE;   
// ISO19794-2 SGISOTemplateInfo sample_info $=$ {0}; err $=$ SGFPM_GetIsoCompactTemplateInfo(m_hFPM, m_StoredTemplate, &sample_info);

matched $=$ FALSE;   
int found_finger $\equiv$ -1;   
for (int $\overline{\mathbf{i}} = 0$ ; i $<  _{i}$ sample_info.TotalSamples; i++)   
{ //ISO19794-2 compact card template err $=$ SGFPMMATCHIsoCompactTemplate(m_hFPM,m StoredTemplate,i, m_FetBufM,0,SL_NORMAL,&matched); if (matched) { found_finger $=$ sample_info/sampleInfo[i].FingerNumber; break; }

# 3.11. Registration process

To register a fingerprint, a fingerprint image is firstcaptured,and then feature data (minutiae)is extracted from the image into a template.It is recommended to capture at least two image samples per fingerprint for a higher degree of accuracy.The minutiae data from each image can then be compared against each other (i.e. matched) to confirm the quality of the registered fingerprints. This comparison is analogous to a password confirmation routine that is commonly required for entering a new password.

# Overview of Registration Process

1. Capture fingerprint images: SGFPM_Getlmage() or SGFPM_GetlmageEx()   
2.Extract minutiae from each captured fingerprint image: SGFPM_CreateTemplate()   
3.Match each template to determine if they are acceptable for registration: SGFPM_MatchTemplate()   
4.Save templates to file or database to complete registration

# Example: Using two fingerprint images to register one fingerprint

```objectivec
BYTE* m_RegTemplate1;  
BYTE* m_RegTemplate2;  
err = SGFPM_GetMaxTemplateSize(m_hFPM, &m_MaxTemplateSize);  
m_RegTemplate1 = new BYTE[m_MaxTemplateSize];  
m_RegTemplate2 = new BYTE[m_MaxTemplateSize];  
// Get first fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, qlty);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_RegTemplate1);  
// Get second fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, qlty);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_RegTemplate2);  
DWORD sl = SL_NORMAL; // Set security level as NORMAL  
BOOL matched;  
err = SGFPM_MatchTemplate(m_hFPM, m_RegTemplate1, m_RegTemplate2, sl, &matched);  
if (matched)  
// Save these templates somewhere 
```

# 3.12. Verification Process

The verification process involves matching newly input minutiae data against registered minutiae data. Similar to the registration_process,verification requires the capture of a fingerprint image folowed by extraction of the minutiae data from the captured image into a template.

# Overview of Verification Process

1. Capture fingerprint image: SGFPM_Getlmage() or SGFPM_GetlmageEx()   
2.Extract minutiae data from captured image: SGFPM_CreateTemplate()   
3.Match newly made template against registered templates: SGFPM_MatchTemplate()

- Adjust the security level according to the type of application.For example,if fingerprintonly authentication is used, set the security level higher than SL_NORMAL to reduce false acceptance (FAR).

Example: Input minutiae data is matched against two registered minutiae data samples   
BYTE* m_VrfTemplate1;   
err $=$ SGFPM_GetMaxTemplateSize(m_hFPM,&m_MaxTemplateSize);   
m_VrfTemplate1 $\equiv$ new BYTE[m_MaxTemplateSize];   
// Get first fingerprint image and create template from the image   
DWORD qlty $= 50$ .   
err $=$ SGFPM_GetImageEx(m_hFPM,m_ImgBuf,5000,NULL,qlty);   
err $=$ SGFPM_CreateTemplate(m_hFPM,0,m_ImgBuf,m_VrfTemplate1);   
DWORD sl $=$ SL_NORMAL; // Set security level depending on applications.   
DWORD err;   
BOOL matchedl, matched2;   
err $=$ SGFPM MatchTemplate(m_hFPM,m_RegTemplate1,m_VrfTemplate1,sl);   
err $=$ SGFPM MatchTemplate(m_hFPM,m_RegTemplate2,m_VrfTemplate1,sl);   
if (err $= =$ SGSGFDX_ERROR_NONE) { if (matchedl && matched2) //Matched else // Not matched

# 3.13. Getting Matching Score

For improved quality control during the registration or verification process,a matching score can be used instead of a security level setting to determine the success of the operation.The matching score can be specified so that only sets of minutiae data that exceed the score willbe accepted; data below the score will be rejected.The matching score may have a value from O to 199. SGFPM_GetMatchingScore() requires two sets of minutiae data of the same template format. SGFPM_GetMatchingScoreEx() requires two sets of minutiae data,butthey can take different template formats.For more information about template formats, refer to Section 3.15. Template Format.

For more information about SGFPM_GetMatchingScoreEx(), refer to Section 4.5. Matching Functions.

```txt
DWORD score;  
if (SGFPM_GetMatchingScore(m_hFPM, m_RegTemplate1, m_RegTemplate1, &score) == SGSGFDX_ERROR_NONE)  
{  
    if (score > 100)  
        // Enroll these fingerprints to database  
    else  
        // Try again  
} 
```

To understand how the matching score correlates with typical security levels,refer to the chart below. For more information about security levels, refer to Section 4.5. Matching Functions.

Security Level vs. Matching Score   
![](images/61d2ec5ef17afb6b398e87587efe43644a1d7cd7c72fbb165213e1265541e020.jpg)

Note: The Matching Scores have changed after version 3.53 of FDx SDK Pro.

# 3.14. Using Auto-On TM

Auto-OnTM is a function that alows the reader to automatically detect the presence of a finger without requiring the user to prompt the system before receiving a fingerprint.To use this function,Auto-On should be enabled using SGFPM_EnableAutoOnEvent(). Once Auto-On is enabled,the application can receive a message from the device driver whenever an Auto-On event occurs in the reader.

When callng SGFPM_EnableAutoOnEvent(), pass the handle of the window which will receive the Auto-On message.The Auto-On message is defined as Ox8100 in sgfplib.h.When the application receives an Auto-On message, wParam will have event type (Finger ON or OFF)and IParam willhave information of the device from which the event occurred.

Note: Auto-On is not supported by FDU02-based readers.

# ·Enabling Auto-On

```txt
[Example] #define WM_APP_SGAUTOONEVENT 0x8100 if ((device_name == SG_DEV_FDU03) || (device_name == SG_DEV_FDU04)) 
```

```txt
{ SGFPM_EnableAutoOnEvent(m_hFPM，TRUE，this.m_hWnd，0);   
} 
```

# ·Disabling Auto-On

```lisp
[Example]  
if ((device_name == SG_DEV_FDU03) || (device_name == SG_DEV_FDU04))  
{  
    SGFPM_EnableAutoOnEvent(m_hFPM, FALSE, this.m_hWnd, 0);  
} 
```

# ·Handling Auto-On event in application

ONMESSAGE (WM_APP_SGAUTOONEVENT, OnAutoOnEvent)   
LRESULT CSgdvcDlg::OnAutoOnEvent(WPARAM wParam, LPARAM lParam)   
{ WORD isfinger $=$ wParam; SGDeviceInfoParam device_info; memcpy(&device_info,(SGDeviceInfoParam\*)lParam,sizeof(device_info); if(isfinger $\equiv =$ SGDEVEVNET_FINGER_ON) { m_ErrorDisplay.Format(_T("Device Event:Finger ON,DevId:%d，SN:%s")， device_info.DeviceID,device_info.DeviceSN); DWORD err $=$ m_Sensor->GetImageEx(m_ImgBuf,3000,m/ImageBox.m_hWnd,30); } else if(isfinger $\equiv =$ SGDEVEVNET_FINGER_OFF) { m_ErrorDisplay $=$ TEXT("Device event: Finger Off"); } UpdateData(FALSE); return 1;

# 3.15.Template Format

The FDx SDK Pro supports four types of fingerprint template formats:

SG40o: SecuGen's proprietary template format   
·ANSl378: ANSI-INCITS 378-2004“Finger Minutiae Format for Data Exchange”   
IS019794-2: ISO/IEC 19794-2:2005 "Biometric Data Interchange Formats - Part 2: Finger Minutiae Data"   
IS019794-2 Compact4: ISO/IEC 19794-2:2005 "Biometric Data Interchange Formats- Part 2: Finger Minutiae Data" - Section 8.2 Compact Size Finger Minutiae Format (Compact Card Format)

As default, SGFPM creates SecuGen_proprietary templates (TEMPLATE_FORMAT_SG400). To change the template format, use SGFPM_SetTemplateFormat().

SG400 templates are encrypted for high security and have a size of 400 bytes.ANSl378 and ISO19794-2 templates are not encrypted,and their size is variable depending on how many fingers are registered in the structure and how many minutiae points are found.

For more information about the ANSl378 template，refer to the standard document titled “Information technology - Finger Minutiae Format for Data Interchange,”(document number ANSl-INCITS 378-2004) available at the ANSl website http://webstore.ansi.org.

For more information about the ISO19794-2 and ISO19794-2 Compact templates,refer to the standard document itled “Information technology--Biometric Data Interchange Formats--Part 2: Finger Minutiae Data,"(document number ISO / IEC 19794-2:2005) available at the ISO website https://www.iso.org/standard/38746.html.

Once the template format is set, it will affect the execution of the SGFPM module.

The following APls are affected by SGFPM_SetTemplateFormat():

SGFPM_GetMaxTemplateSize()   
SGFPM_CreateTemplate()   
SGFPM_GetTemplateSize()   
SGFPM_MatchTemplate()   
SGFPM_GetMatchingScore()

The following APls work only when the template format is TEMPLATE_FORMAT_ANSI378:

SGFPM_GetTemplateSizeAfterMerge()   
SGFPM_MergeAnsiTemplate()   
SGFPM_MergeMultipleAnsiTemplate()   
SGFPM_GetAnsiTemplatelnfo()   
SGFPM_MatchAnsiTemplate()   
SGFPM_GetAnsiMatchingScore()

The following APls Work only when the template format is TEMPLATE_FORMAT_IS019794:

SGFPM_GetlsoTemplateSizeAfterMerge()   
SGFPM_MergelsoTemplate()   
SGFPM_MergeMultiplelsoTemplate()   
SGFPM_GetlsoTemplatelnfo()   
SGFPM_MatchlsoTemplate()   
SGFPM_GetlsoMatchingScore()

The following APls work only when the template format is TEMPLATE_FORMAT_ISO19794_COMPACT:

SGFPM_GetlsoCompactTemplateSizeAfterMerge()   
SGFPM_MergelsoCompactTemplate()   
SGFPM_MergeMultiplelsoCompactTemplate()   
SGFPM_GetlsoCompactTemplatelnfo()   
SGFPM_MatchlsoCompactTemplate()   
SGFPM_GetlsoCompactMatchingScore()

The following APls work with any template format:

SGFPM_MatchTemplateEx()   
SGFPM_GetMatchingScoreEx()

The following APls work for Bluetooth SPP (U20-ASF-BT, SPP) devices and do not affect the other APls above.

SGFPM_CreateTemplateDev()   
SGFPM_GetTemplateDev()

SGFPM_GetTemplateFormatDev()   
SGFPM_SetTemplateFormatDev()

# ·Defining template format

enum SGFDxTemplateFormat   
{ TEMPLATE_FORMAT_ANSI378 $= 0\mathrm{x}0100$ ， TEMPLATE_FORMAT_SG400 $= 0\mathrm{x}0200$ ， TEMPLATE_FORMAT_ISO19794 $= 0\mathrm{x}0300$ ， TEMPLATE_FORMAT_ISO19794_COMPACT $= 0\mathrm{x}0400$ 1

# ·Setting template format to ANSl378

```txt
SGFPM_SetTemplateFormat(m_hFPM, TEMPLATE_FORMAT_ANSI378); 
```

# ·Setting template format to SG400

```txt
SGFPM_SetTemplateFormat(m_hFPM, TEMPLATE_FORMAT_SG400); 
```

# ·Setting template format to ISO19794

```txt
SGFPM_SetTemplateFormat(m_hFFM, TEMPLATE_FORMAT_ISO19794); 
```

# Setting template format to ISO19794 Compact Card Format

```txt
SGFPM_SetTemplateFormat(m_hFPM, TEMPLATE_FORMAT_ISO19794_COMPACT); 
```

# 3.16. Manipulating ANSl378 Templates

The ANSl378 template format alows multiple fingers and multiple views per finger to be stored in one template.To support this feature, FDx SDK Pro provides the following special APls:

SGFPM_GetTemplateSizeAfterMerge()   
SGFPM_MergeAnsiTemplate()   
SGFPM_MergeMultipleAnsiTemplate()   
SGFPM_GetAnsiTemplatelnfo()   
SGFPM_MatchAnsiTemplate()   
SGFPM_GetAnsiMatchingScore()

# ·Merging two ANSl378 templates

After creating an ANSl378 template from a fingerprint image,additional ANSl378 templates can be merged into one template.To do this,use SGFPM_MergeAnsiTemplate(), which takes two ANSl378 templates and merges tem into one template.The size of the merged template will be smaller than the sum of the sizes of allinput templates. Cal SGFPM_GetTemplateSizeAfterMerge() to obtain the exact template size of the merged template before using SGFPM_MergeAnsiTemplate().

```sql
BYTE\* m_Template1;  
BYTE\* m_Template2; 
```

```objectivec
err = SGFPM_GetMaxTemplateSize(m_hFPM, &m_MaxTemplateSize);  
m_Template1 = new BYTE[m_MaxTemplateSize];  
m_Template2 = new BYTE[m_MaxTemplateSize];  
// Get first fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, 80);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_Template1);  
// Get second fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, 80);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_Template2);  
// Save template after merging two templates - m_Template1, m_Template2  
BYTE* merged_template;  
DWORD buf_size;  
err = SGFPM_GetTemplateSizeAfterMerge(m_hFPM, m模板1, m模板2, &buf_size);  
merged_template = new BYTE[buf_size];  
err = SGFPM_MergeAnsiTemplate(m_hFPM, m模板1, m模板2, merged_template);  
// Save m_EnrollTemplate to file  
...  
SaveTemplate(file_name, merged_template, buf_size);  
delete [] merged_template; // Freed by calling application 
```

# ·Merging multiple ANSl378 templates

More_thantwo.ANSl378templatesmaybemergedintoonetemplateusing SGFPM_MergeMultipleAnsiTemplate(). The size of the merged template willbe smaller than the sum of the sizes of all source templates.To determine the bufer size for the merged template,use the sum of the size for each template and then later obtain the actual size of merged template after caling SGFPM_MergeMultipleAnsiTemplate().

```txt
BYTE* target_template;  
DWORD size1, size2;  
DWORD err;  
DWORD real_size = 0;  
// Buffer for input templates - source template  
err = SGFPM_GetTemplateSize(m_hFPM, template1, &size1);  
err = SGFPM_GetTemplateSize(m_hFPM, template2, &size2);  
BYTE* source_template = new BYTE[size1 + size2]; // Make stack of each template  
memcpy(&source_template[0], template1, size1);  
memcpy(&source_template[size1], template2, size2);  
// Allocate buffer for output template - merged template  
target_template = new BYTE[size1 + size2];  
err = SGFPM_MergeMultipleAnsiTemplate(m_hFPM, source_template, 2, target_template);  
delete [] source_template;  
// Get actual size of merged_template 
```

// Actual size will be less than sizel+size2 err $=$ SGFFM_GetTemplateSize(m_hFPM,target_template,&real_size);

# ·Getting information about an ANSl378 template

The ANSl378 template format allows multiple fingers and multiple views per finger to be stored in one template.To match one sample (view) against a sample in other template, information about the template may be needed. To get sample information about a template, use SGFPM_GetAnsiTemplatelnfo().

DWORD err;   
int matched_samples $= 0$ .   
SGANSITemplateInfo sample_info1, sample_info2;   
err $=$ SGFPM_GetAnsiTemplateInfo(m_hFPM,g_EnrollData,&sample_info1);   
err $=$ SGFPM_GetAnsiTemplateInfo(m_hFPM,g_VrfData,&sample_info2);   
for (int i $= 0$ ;i $<$ sample_info1.TotalSamples; $\mathrm{i + + )}$ { for (int j $= 0$ ;j $<$ sample_info2.TotalSamples; $\mathrm{j + + )}$ { BOOL matched; err $=$ SGFPM MatchAnsiTemplate(m_hFPM,g_EnrollData,i,g_VrfData,0,s1, &matched); if (matched) matched_samples++; }   
}   
if (err $= =$ SGFDX_ERROR_NONE) { if (matched_samples) m(ResultEdit.Format("Found %d matched samples: ", matched_samples); else m(ResultEdit.Format("Cannot find matched sample"));   
}   
else m(ResultEdit.Format("MatchTemplate() failed. Error $= \% d$ ", err);

# 3.17. Manipulating ISO19794-2 Templates

The ISO19794-2 template format allows multiple fingers and multiple views per finger to be stored in one template. To support this feature, FDx SDK Pro provides the following special APls:

SGFPM_GetlsoTemplateSizeAfterMerge()   
SGFPM_MergelsoTemplate()   
SGFPM_MergeMultiplelsoTemplate()   
SGFPM_GetlsoTemplatelnfo()   
SGFPM_MatchlsoTemplate()   
SGFPM_GetlsoMatchingScore()

# ·Merging two ISO19794-2 templates

After creating an ISO19794-2 template from a fingerprint image,additional ISO19794-2 templates can be merged into one template.To do this,use SGFPM_MergelsoTemplate()，which takes two ISO19794-2

templates and merges them into one template. The size of the merged template willbe smaller than the sum of the sizes of allinput templates. Cal SGFPM_GetlsoTemplateSizeAfterMerge() to obtain the exact template size of the merged template before using SGFPM_MergelsoTemplate().

```txt
BYTE* m_Template1;  
BYTE* m_Template2;  
// Set template format to ISO19794-2  
err = SGFPM_SetTemplateFormat(m_hFPM, TEMPLATE_FORMAT_ISO19794);  
err = SGFPM_GetMaxTemplateSize(m_hFPM, &m_MaxTemplateSize);  
m_Template1 = new BYTE[m_MaxTemplateSize];  
m_Template2 = new BYTE[m_MaxTemplateSize];  
// Get first fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, 80);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_Template1);  
// Get second fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, 80);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_Template2);  
// Save template after merging two templates - m_Template1, m_Template2  
BYTE* merged_template;  
DWORD buf_size;  
err = SGFPM_GetIsoTemplateSizeAfterMerge(m_hFPM, m模板1, m模板2, &buf_size);  
merged_template = new BYTE[buf_size];  
err = SGFPM_MergeIsoTemplate(m_hFPM, m模板1, m模板2, merged_template);  
// Save m_EnrollTemplate to file  
...  
SaveTemplate(file_name, merged_template, buf_size);  
delete [] merged_template; // Freed by calling application 
```

# Merging multiple ISO19794-2 templates

More_thantwoISO19794-2templatesmaybemergedintoonetemplateusing SGFPM_MergeMultiplelsoTemplate().The size of the merged template will be smaller than the sum of the sizes of allsource templates.To determine the buffer size for the merged template,use the sum of the size for each template and then later obtain the actual size of merged template after caling SGFPM_MergeMultiplelsoTemplate().

```txt
BYTE* target_template;   
DWORD size1, size2;   
DWORD err;   
DWORD real_size = 0;   
// Buffer for input templates - source template   
err = SGFPM_GetTemplateSize(m_hFPM, template1, &size1);   
err = SGFPM_GetTemplateSize(m_hFPM, template2, &size2);   
BYTE* source_template = new BYTE[sizel + size2]; // Make stack of each template memcpy(&source_template[0], template1, size1); 
```

```txt
memcpy(&source_template[size1], template2, size2);
// Allocate buffer for output template - merged template
target_template = new BYTE[size1+ size2];
err = SGFPM_MergeMultipleIsoTemplate(m_hFPM, source_template, 2, target_template);
delete [] source_template;
//Get actual size of merged_template
//Actual size will be less than size1+size2
err = SGFPM_GetTemplateSize(m_hFPM, target_template, &real_size); 
```

# ·Getting information about an ISO19794-2 template

The ISO19794-2 template format allows multiple fingers and multiple views per finger to be stored in one template.To match one sample (view) against a sample in other template, information about the template may be needed.To get sample information about a template, use SGFPM_GetlsoTemplatelnfo().

DWORD err;   
BOOL matched $=$ FALSE;   
// ISO19794-2 SGISOTemplateInfo sample_info $\equiv$ {0}; err $=$ SGFPM_GetIsoTemplateInfo(m_hFPM, m_StoredTemplate, &sample_info); matched $=$ FALSE; int found_finger $= -1$ for (int i $= 0$ ; i $<$ sample_info.TotalSamples; i++) { // ISO19794-2 err $=$ SGFPM MatchIsoTemplate(m_hFPM, m_StoredTemplate, i, m_FetBufM, 0, SL_NORMAL, &matched); if (matched) { found_finger $=$ sample_info/sampleInfo[i].FingerNumber; break; }   
}   
if (err $= =$ SGFDX_ERROR_NONE) { if (found_finger $> = 0$ ) m(ResultEdit.Format("The fingerprint data found. Finger Position: %s", g_FingerPosStr[found_finger]); else m(ResultEdit.Format("Cannot find matched fingerprint data"); } else { m(ResultEdit.Format("MatchIsoTemplate() failed. Error $= \% d$ ", err); }

# 3.18. Manipulating ISO19794-2 Compact Card Templates

The ISO19794-2 compact card template format alows multiple fingers and multiple views per finger to be stored in one template.It also encodes minutiae in the compact size finger minutiae format. To support this feature,FDx SDK Pro provides the following special APls:

SGFPM_GetlsoTemplateSizeAfterMerge()   
SGFPM_MergelsoTemplate()   
SGFPM_MergeMultiplelsoTemplate()   
SGFPM_GetlsoTemplatelnfo()   
SGFPM_MatchlsoTemplate()   
SGFPM_GetlsoMatchingScore()

# ·Merging two ISO19794-2 compact card templates

After creating an ISO19794-2 compact card template from a fingerprint image，additional ISO19794-2 compact cardtemplatescanbemergedintoonetemplate. Todothis， use SGFPM_MergelsoCompactTemplate()，which takes two ISO19794-2 compact card templates and merges them into one template.The size ofthe merged template will be smaller than the sum of the sizes of all input templates. Call SGFPM_GetlsoCompactTemplateSizeAfterMerge() to obtain the exact template size of the merged template before using SGFPM_MergelsoCompactTemplate().

```c
BYTE* m_Template1;  
BYTE* m_Template2;  
// Set template format to ISO19794-2 compact card format  
err = SGFPM_SetTemplateFormat(m_hFPM, TEMPLATE_FORMAT_ISO19794_COMPACT);  
err = SGFPM_GetMaxTemplateSize(m_hFPM, &m_MaxTemplateSize);  
m_Template1 = new BYTE[m_MaxTemplateSize];  
m_Template2 = new BYTE[m_MaxTemplateSize];  
// Get first fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, 80);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_Template1);  
// Get second fingerprint image and create template from the image  
err = SGFPM_GetImageEx(m_hFPM, m_ImgBuf, 5000, NULL, 80);  
err = SGFPM_CreateTemplate(m_hFPM, 0, m_ImgBuf, m_Template2);  
// Save template after merging two templates - m_Template1, m_Template2  
BYTE* merged_template;  
DWORD buf_size;  
err = SGFPM_GetIsoCompactTemplateSizeAfterMerge(m_hFPM, m模板1, m模板2, &buf_size);  
merged_template = new BYTE[buf_size];  
err = SGFPM_MergeIsoCompactTemplate(m_hFPM, m模板1, m模板2, merged_template);  
// Save m_EnrollTemplate to file  
...  
SaveTemplate(file_name, merged_template, buf_size);  
delete [] merged_template; // Freed by calling application 
```

# ·Merging multiple ISO19794-2 compact card templates

More than two ISO19794-2 compact card templates may be merged into one template using SGFPM_MergeMultiplelsoCompactTemplate().The size of the merged template willbe smaler than the sum of the sizes of all source templates.To determine the buffer size for the merged template, use the sum of the size for each template and then later obtain the actual size of merged template after caling

SGFPM_MergeMultiplelsoCompactTemplate().   
```txt
BYTE* target_template;   
DWORD size1, size2;   
DWORD err;   
DWORD real_size = 0;   
// Buffer for input templates - source template   
err = SGFPM_GetTemplateSize(m_hFPM, template1, &size1);   
err = SGFPM_GetTemplateSize(m_hFPM, template2, &size2);   
BYTE* source_template = new BYTE[size1 + size2]; // Make stack of each template memcpy(&source_template[0], template1, size1);memcpy(&source_template[size1], template2, size2);   
// Allocate buffer for output template - merged template   
target_template = new BYTE[size1+ size2];   
err = SGFPM_MergeMultipleIsoCompactTemplate(m_hFPM, source_template, 2, target_template);   
delete [] source_template;   
// Get actual size of merged_template   
// Actual size will be less than sizel+size2   
err = SGFPM_GetTemplateSize(m_hFPM, target_template, &real_size); 
```

# ·Getting information about an ISO19794-2 compact card template

The ISO19794-2 compact card template format alows multiple fingers and multiple views per finger to be stored in one template.To match one sample (view) against a sample in other template,information about thetemplatemaybeneeded. Toget sampleinformationaboutatemplate， use SGFPM_GetlsoCompactTemplatelnfo().

```c
DWORD err;  
BOOL matched = FALSE;  
// ISO19794-2  
SGISOTemplateInfo sample_info = {0};  
err = SGFPM_GetIsoCompactTemplateInfo(m_hFPM, m_StoredTemplate, &sample_info);  
matched = FALSE;  
int found_finger = -1;  
for (int i = 0; i < sample_info.TotalSamples; i++)  
{ // ISO19794-2  
err = SGFPM_AlchIsoCompactTemplate(m_hFPM, m_StoredTemplate, i, m_FetBufM, 0, SL_NORMAL, &matched);  
if (matched)  
{ found_finger = sample_info SampleInfo[i].FingerNumber; break; }  
}  
if (err == SGFDX_ERROR_NONE)  
{ if (found_finger >= 0) m(ResultEdit.Format("The fingerprint data found. Finger Position: %s", 
```

```txt
g_FingerPosStr[found_finger]); else m(ResultEdit.Format("Cannot find matched fingerprint data"); } else { m(ResultEdit.Format("MatchIsoCompactTemplate() failed. Error = %d ", err); } 
```

# 3.19. Getting Version Information of MINEX Compliant Algorithms

To obtain version information about the MINEX Compliant algorithms,use SGFPM_GetMinexVersion(). Currently,the extractor version number is Ox000A0035,and the matcher version number is Ox000A8035.

```txt
DWORD extractor, matcher;  
err = SGFPM_GetMinexVersion(m_hFPM, &extractor, &mapper);  
CString sz_ver;  
sz_ver.Format(" (Extractor:0x%08X, Matcher:0x%08X) ", extractor, mapper);  
SetWindowText(_T("SecuGen ANSI MINEX Test") + sz_ver); 
```

# Chapter 4. Function Reference

# 4.1. SGFPM Creation and Termination

# DWORD SGFPM_Create(HSGFPM* hFPM)

Creates the SGFPM object internally

. Parameters

hFPM

The pointer to contain the handle of the SGFPM object

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_CREATION_FAILED = Failed to create SGFPM object

# SGFPM_Terminate(HSGFPM hFpm)

Exits the SGFPM module

. Parameters

hFpm

The handle of the SGFPM object

Return values

SGFDX_ERROR_NONE = No error

# 4.2. Initialization

# DWORD SGFPM_Init(HSGFPM hFpm, DWORD devName)

Initializes SGFPM with device name information.The SGFPM object loads appropriate drivers with device name (devName) and initializes fingerprint algorithm module based on the device information.

. Parameters

hFpm

The handle of the SGFPM object

devName

Specifies the device name

SG_DEV_FDU02: device name for FDU02-based USB readers

SG_DEV_FDU03: device name for FDU03 and SDU03-based USB readers

SG_DEV_FDU04: device name for FDU04 and SDU04-based USB readers

SG DEV FDU05: device name for U20-based USB readers

SG DEV FDU06: device name for UPx-based USB readers

SG DEV FDU06AP: device name for UPx-AP based USB readers

SG_DEV_FDU07: device name for U10-based USB readers

SG_DEV_FDU08: device name for U20-A based USB readers

SG_DEV_FDU08A: device name for U20-AP based USB readers

SG DEV FDU08AL: device name for U20-AL based USB readers

SG DEV FDU09A: device name for U30 based USB readers

SG DEV FDU10A: device name for U-AIR based contactless USB readers

SGDEV_FDUSDA: device name for U20-ASF-BT (Bluetooth SPP) based readers

SG_DEV_FDUSDA_BLE: device name for U20-ASF-BT (Bluetooth BLE) based readers

Return values

```txt
SGFDX_ERROR_NONE = No error  
SGFDX_ERROR Creation_FAILED = Failed to create SGFPM object  
SGFDX_ERROR_INVALID_PARAMETER = Invalid parameter used  
SGFDX_ERROR_DRV_LOAD_FAILED = Failed to load driver 
```

# DWORD SGFPM_InitEx2(HSGFPM hFpm, DWORD width, DWORD height, DWORD dpi, char* licenseFilePath)

Initializes SGFPM with image information. Use when running fingerprint algorithm module without a

SecuGen reader. Note: SGFPM_InitEx() is no longer supported.

. Parameters

```txt
hFpm The handle of the SGFPM object width Image width in pixels height Image height in pixels dpi Image resolution in DPI licenseFilePath Path to a license file 
```

Return values

```c
SGFDX_ERROR_NONE = No error  
SGFDX_ERROR Creation_FAILED = Failed to create SGFPM object  
SGFDX_ERROR_INVALID_PARAMETER = Invalid parameter used  
SGFDX_ERROR_DLLLOAD_FAILED = Failed to load algorithm DLL  
SGFDX_ERRORLICENSE_LOAD = Cannot find a license file  
SGFDX_ERRORLICENSE_KEY = Invalid license key  
SGFDX_ERRORLICENSE_EXPIRED = license expired 
```

# DWORD SGFPM_SetTemplateFormat(HSGFPM hFpm, WORD format)

Sets template format. Default format is SecuGen proprietary format (TEMPLATE_FORMAT_SG400).

. Parameters

```txt
hFpm The handle of the SGFPM object format Specifies template format: TEMPLATE_FORMAT_ANSI378: TEMPLATE_FORMAT_SG400: S TEMPLATE_FORMAT_ISO19794 TEMPLATE_FORMAT_ISO19794 
```

Return values

```txt
SGFDX_ERROR_NONE = No error SGFDX_ERROR Creation_FAILED = Failed to create SGFPM object SGFDX_ERROR_INVALID_template_TYPE: Wrong template format 
```

# DWORD SGFPM_SetTemplateFormatDev(HSGFPM hFpm, WORD format)

Sets template format. Default format is SecuGen proprietary format (TEMPLATE_FORMAT_SG400). Only works with SGFPM_CreateTemplateDev().

. Parameters

hFpm

The handle of the SGFPM object

format

Specifies template format:

TEMPLATE_FORMAT_ANSI378: ANSI-INCITS 378-2004 format

TEMPLATE_FORMAT_SG400: SecuGen proprietary format

TEMPLATE_FORMAT_ISO19794: ISO/IEC 19794-2:2005 format

The following format is not supported:

TEMPLATE_FORMAT_ISO19794_COMPACT: ISO/IEC 19794-2:2005 c0mpact card format

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_CREATION_FAILED = Failed to create SGFPM object

SGFDX_ERROR_INVALID_TEMPLATE_TYPE: Wrong template format

# 4.3. Device and Capturing Functions

# DWORD SGFPM_EnumerateDevice(HSGFPM hFpm, DWORD* ndevs, SGDeviceList** devList, DWORD devName = SG_DEV_UNKNOWN)

Enumerates currently attached reader to the system. If devName is not specified (SG_DEV_UNKNOWN), then it returns alist of allSecuGen readers attached to the system.If devName is specified,it enumerates only the device(s) that belong to the specified device class.

Parameters

hFpm

The handle of the SGFPM object

ndevs

The number of attached USB readers

devList

Buffer that contains device ID and device serial number. For more information, see Section 5.3. SGDeviceList.

devName

Device name:

SG_DEV_UNKNOWN = 0

SG DEV FDU02 = 0x03 // FDU02

SG_DEV_FDU03 = 0x04 // FDU03 and SDU03

SG DEV_FDU04 = 0x05 I/ FDU04 and SDU04

SG_DEV_FDU05 = 0x06 // U20

SG DEV_FDU06 = 0x07 // UPx

SG DEV FDU06AP = 0x16 I/ UPx-AP

SG DEV FDU07 = 0x08 // U10

SG DEV FDU08 = 0x0A I/ U20-A

SG DEV_FDU08A= 0x11 I/ U20-AP

SG DEV_FDU08AL= 0x17 // U20-AL

SG DEV_FDU09A= 0x12 // U30

SG DEV FDU10A= 0x13 // U-AIR

SG_DEV_FDUSDA = 0x0D // U20-ASF-BT (Bluetooth SPP)

SG_DEV_FDUSDA_BLE= Ox0E//U20-ASF-BT (BIuet00th BLE)

Returned values

SGFDX ERROR NONE = No error

SGFDX_ERROR_FUNCTION_FAILED = General function fail error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

# DWORD SGFPM_FindDevices(HSGFPM hFpm, DWORD* ndevs, SGDeviceList** devList, DWORD timeout)

Enumerates U20-ASF-BT (BLE) devices around the system. The last parameter, timeout, is recommended to be at least 10 seconds. Otherwise, ghost U20-ASF-BT (BLE) devices5 could be enumerated.

. Parameters

hFpm

The handle of the SGFPM object

ndevs

The number of U20-ASF-BT (BLE) devices found

devList

Buffer that contains device name and ID string. see Section 5.3. SGDeviceList.

timeout

timeout in millisecond

Returned values

SGFDX ERROR NONE = No error

SGFDX ERROR FUNCTION_FAILED = General function fail error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

# DWORD SGFPM_CanceIFind(HSGFPM hFpm)

Cancels finding U20-ASF-BT (BLE) devices.

Parameters

hFpm

The handle of the SGFPM object

Returned values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_FUNCTION_FAILED = General function fail error

# DWORD SGFPM_OpenDevice(HSGFPM hFpm, DWORD devld)

Initializes the fingerprint reader.

. Parameters

hFpm

The handle of the SGFPM object

devld

Specifies the device ID for USB readers (value: 0 to 9). The maximum number of supported readers that may be attached at the same time is 10.If AUTO_DETECT is selected, the device driver will find its port address automatically.

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_SYSLOAD_FAILED = Failed to loading system files

SGFDX_ERROR_INITIALIZE_FAILED = Failed to initialize chip

SGFDX_ERROR_DEVICE_NOT_FOUND = Device not found

# DWORD SGFPM_OpenDevice2(HSGFPM hFpm, wchar_t *devld)

Initializes the Bluetooth BLE fingerprint reader. (U20-ASF-BT BLE only)

Parameters

hFpm

The handle of the SGFPM object

devld

Specifies the device ID string which can be retrieved by SGFPM_FindDevices().

Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_SYSLOAD_FAILED = Failed to loading system files

SGFDX_ERROR_INITIALIZE_FAILED = Failed to initialize chip

SGFDX_ERROR_DEVICE_NOT_FOUND = Device not found

# DWORD SGFPM_CloseDevice(HSGFPM hFpm)

Closes the opened device. SGFPM_OpenDevice() must be called before this function is used.

. Parameters

The handle of the SGFPM object

Return values

SGFDX_ERROR_NONE = No error

# DWORD SGFPM_GetDevicelnfo(HSGFPM hFpm, SGDevicelnfoParam* plnfo)

Gets device information from the driver (before device initialization)

Parameters

hFpm

The handle of the SGFPM object

pinfo

A pointer to SGDevicelnfoParam. SGDevicelnfoParam is explained in Chapter_5. Structure Reference.

Return values

SGFDX_ERROR_NONE = No error

# DWORD SGFPM_Configure(HSGFPM hFpm, HWND hwnd)

Displays the driver's configuration dialog box

Parameters

hFpm

The handle of the SGFPM object

hwnd

The parent window handle

Return values

SGFDX_ERROR_NONE = No error

# DWORD SGFPM_SetBrightness(HSGFPM hFpm, DWORD brightness)

Controls brightness of image sensor

. Parameters

hFpm

The handle of the SGFPM object

# brightness

Brightness value (from 0 to 100)

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

# DWORD SGFPM_SetLedOn(HSGFPM hFpm, bool on)

Turns optic unit LED on/off

# Parameters

# hFpm

The handle of the SGFPM object

on

True: Turns on LED

False: Turns off LED

# Return values

SGFDX_ERROR_NONE = No error

# DWORD SGFPM_GetImage(HSGFPM hFpm, BYTE* buffer)

Captures a 256 gray-level fingerprint image from the reader. The image size can be retrieved by caling SGFPM_GetDevicelnfo(). SGFPM_Getlmage() does not check for image quality.To get image quality of a captured image,use SGFPM_GetlmageQuality(). To get the approximate image quality while capturing, use GetlmageEx().

# . Parameters

# hFpm

The handle of the SGFPM object

# buffer

A pointer to the bufer containing a fingerprint image. The image size can be retrieved by caling GetDevicelnfo().

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_WRONG_IMAGE = Capture image is not a real fingerprint image

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_LINE_DROPPED = Image data lost

# DWORD SGFPM_BeginGetImage(HSGFPM hFpm)

Prepares for SGFPM_Getlmage() to start capture. Must cal SGFPM_EndGetlmage() later.

# Parameters

# hFpm

The handle of the SGFPM object

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_UNSUPPORTED_DEV= Not supported

# DWORD SGFPM_EndGetImage(HSGFPM hFpm)

Closes SGFPM_GetImage() to finish capture

# Parameters

# hFpm

The handle of the SGFPM object

# Return values

```txt
SGFDX_ERROR_NONE = No error  
SGFDX_ERROR_INVALID_PARAMETER = Invalid parameter used  
SGFDX_ERROR_UNSUPPORTED_DEV = Not supported 
```

# DWORD SGFPM_GetlmageQuality(HSGFPM hFpm, DWORD width, DWORD height, BYTE* imgBuf, DWORD* quality)

Gets the quality of a captured (scanned) image.The value is determined by two factors. One is the ratio of thefingerprint image area to the whole scanned area,and the other is the ridge quality of the fingerprint image area.A quality value of 50 or higher is recommended for registration.A quality value of 40 or higher is recommended for verification.

Note: The returned quality value is diffrent from the value used in SGFPM_GetlmageEx(). The quality value in SGFPM_GetlmageEx() represents only the ratio of the fingerprint image area to the whole scanned area. SGFPM_GetLastlmageQuality() can be called instead, which willhave the same quality value as SGFPM_GetlmageQuality.

```yaml
- Parameters
hFpm
  - The handle of the SGFPM object
width
  - Image width in pixels
height
  - Image height in pixels
imgBuf
  - Fingerprint image data
quality
  - The return value indicating image quality 
```

```txt
- Return values
    - SGFDX_ERROR_NONE = No error
    - SGFDX_ERROR_INVALID_PARAMETER = Invalid parameter used 
```

# DWORD SGFPM_GetLastImageQuality(HSGFPM hFpm, DWORD* quality)

Gets the quality of the last captured (scanned) image. The value is determined only by one fact, which is theridge qualityof the fingerprintimage area. Aquality value of 70or higher is recommended for registration. A quality value of 50 or higher is recommended for verification.The value ranges from zero to 100.

Note: Not all devices support this function. Therefore,the return value should be checked.

```txt
- Parameters
hFpm
  - The handle of the SGFPM object
quality
  - The return value indicating image quality 
```

```txt
- Return values
    - SGFDX_ERROR_NONE = No error
    - SGFDX_ERROR_INVALID_PARAMETER = Invalid parameter used
    - SGFDX_ERROR_UNSUPPORTED_DEV = Not supported 
```

# DWORD SGFPM_GetlmageEx(HSGFPM hFpm, BYTE* bufer, DWORD time = 0, HWND dispWnd, DWORD quality)

Captures fingerprint images from the reader until the quality of the image is greater than the value of the quality parameter.The captured fingerprint is a 256 gray-level image.Image size can be retrieved by caling

the SGFPM_GetDevicelnfo() function. A quality value of 50 or higher is recommended for registration. A quality value of 40 or higher is recommended for verification.

Note: The returned quality value is diferent from the value used in SGFPM_Getlmage().The quality value in GetlmageEx() represents only the ratio of the fingerprint image area to the whole scanned area.

```txt
- Parameters
hFpm
  The handle of the SGFPM object
buffer
  Pointer to buffer containing a fingerprint image
timeout
  The timeout value (in milliseconds) used to specify the amount of time the function will wait for a valid fingerprint to be input on the fingerprint reader
dispWnd
  Window handle used for displaying fingerprint images
quality
  The minimum quality value of an image, used to determine whether to accept the captured image 
```

```txt
- Return values
    - SGFDX_ERROR_NONE = No error
    - SGFDX_ERROR_INVALID_PARAMETER = Invalid parameter used
    - SGFDX_ERRORLine_DROPPED = Image data lost
    - SGFDX_ERROR_TIME_OUT = No valid fingerprint captured in the given time 
```

# DWORD SGFPM_EnableAutoOnEvent (HSGFPM hFpm, BOOL enable, HWND hwnd, void* reserved)

Allows the reader to automaticaly detect the presence of a finger without requiring the user to prompt the system before receiving a fingerprint. SGFPM_EnableAutoOnEvent() enables or disables the Auto-On function. Once Auto-On is enabled,the application can receive amessage from the device driver whenever an Auto-On event occurs in the reader. (Not supported by FDUo2-based readers.)

When caling SGFPM_EnableAutoOnEvent(), pass the handle of te window that willreceive the Auto-On message. The Auto-On message is defined as Ox8100 in sgfplib.h.

```txt
- Parameters  
hFpm The handle of the SGFPM object  
enable TRUE: Auto-On is enabled FALSE: Auto-On is disabled  
hwnd Window handle to receive Auto-On message  
reserved Not used 
```

```txt
- Return values
    - SGFDX_ERROR_NONE = No error
    - SGFDX_ERROR_INVALID_PARAMETER = Invalid parameter used 
```

```txt
- Remarks
  When the application receives an Auto-On message, wParam will have event type (Finger ON or OFF) and IParam will have information of the device from which the event occurred.
  wParam: Contains event type. SGDEVEVNET_FINGER_ON(1) = Finger is on the sensor 
```

SGDEVEVNET_FINGER_OFF(O)= Finger is removed from the sensor

IParam:

Contains device information. The device information is contained in SGDevicelnfoParam.

# 4.4. Extraction Functions

# DWORD SGFPM_GetMaxTemplateSize(HSGFPM hFpm, DWORD* size)

Gets_the maximum size of a fingerprint template (view or sample). Use this function before using SGFPM_CreateTemplate( to obtain an appropriate bufer size.If the template format is SG400,it returns a fixed length size of 400.

Note: The returned template size means the maximum size of one view or sample.

. Parameters

hFpm

The handle of the SGFPM object

size

The pointer to contain template size

Return values

SGFDX_ERROR_NONE = No error

# DWORD SGFPM_CreateTemplate(HSGFPM hFpm, Fingerlnfo* fpInfo, BYTE *rawlmage, BYTE* minTemplate)

Extracts minutiae from a fingerprint image to form a template having the default format

Parameters

hFpm

The handle of the SGFPM object

fpInfo

Fingerprint information stored in a template.For ANSl378 templates,this information can be retrieved from the template using GetAnsiTemplatelnfo().For ISO19794-2 templates, this information can be retrieved from the template using GetlsoTemplatelnfo(). For ISO19794-2 Compact templates， thisinformationcanberetrievedfromthetemplateusing GetlsoCompactTemplatelnfo(). For SG400 templates, this information cannot be seen in the template. For more information about the structure, refer to Section 5.4 SGFingerlnfo.

rawlmg

256 Gray-level fingerprint image data

minTemplate

Pointer to bufer containing minutiae data extracted from a fingerprint image

# Return values

```c
SGFDX_ERROR_NONE = No error  
SGFDX_ERROR_FEAT_NUMBER = Inadequate number of minutia  
SGFDX_ERROR_INVALID_template_TYPE = Wrong template type  
SGFDX_ERROR_INVALID_template1 = 103 = Error while decoding template 1  
SGFDX_ERROR_INVALID_template2 = 104 = Error while decoding template 2 
```

# DWORD SGFPM_CreateTemplateDev(HSGFPM hFpm, DWORD* size)

Captures a fingerprint image and Extracts minutiae to form a template having the default format.

To get the template, call SGFPM_GetTemplateDev() with a buffer having the size.(U20-ASF-BT only)

# . Parameters

# hFpm

The handle of the SGFPM object

# size

A pointer to the size of the template created.

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_FUNCTION_FAILED

# DWORD SGFPM_GetTemplateDev(HSGFPM hFpm, BYTE* minTemplate)

Gets the template. (U20-ASF-BT only)

# . Parameters

# hFpm

The handle of the SGFPM object

# minTemplate

A pointer to the buffer where the template created is copied

# Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_FUNCTION_FAILED

# DWORD SGFPM_GetTemplateSize(HSGFPM hFpm, BYTE* minTemplate, DWORD* size)

Gets template size. If the template format is SG400,it willreturn 400. If the template format is ANSl378, ISO19794-2,or ISO19794-2 Compact, template size may vary.

# . Parameters

# hFpm

The handle of the SGFPM object

# minTemplate

Pointer to bufer containing minutiae data extracted from a fingerprint image

# size

The pointer to contain template size

# Return values

SGFDX_ERROR_NONE = No error

# 4.5. Matching Functions

DWORD SGFPM_MatchTemplate(HSGFPM hFpm, BYTE *minTemplate1, BYTE *minTemplate2, DWORD secuLevel, BOOL* matched)

Compares two sets of minutiae data of the same template format. The template format should be the same as that set by SGFPM_SetTemplateFormat( and should include only one sample. To match templates that have more than one sample, use SGFPM_MatchTemplateEx(),

SGFPM_MatchAnsiTemplate(), SGFPM_MatchlsoTemplate(), or

SGFPM_MatchlsoCompactTemplate(). It returns TRUE or FALSE as a matching result (matched). The security level (secuLevel) affects matching result and may be adjusted according to the security policy required by the user or organization.

# . Parameters

hFpm

The handle of the SGFPM object

minTemplate1

A pointer to the bufer containing minutiae data extracted from a fingerprint image

minTemplate2

A pointer to the buffer containing minutiae data extracted from a fingerprint image

secuLevel

A security level as specified in “fplibnew.h” by one the following nine security levels:

SL_LOWEST, SL_LOWER,SL_LOW, SL_BELOW_NORMAL,SL_NORMAL (reCOmmended),

SL_ABOVE_NORMAL,SL_HIGH,SL_HIGHER and SL_HIGHEST.

matched

Contains matching result. If passed templates are the same, TRUE is returned. If not, FALSE is returned.

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in minTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in minTemplate2

DWORD SGFPM_MatchTemplateEx(HSGFPM hFpm, BYTE* minTemplate1, WORD templateType1, DWORD sampleNum1, BYTE* minTemplate2, WORD templateType2, DWORD sampleNum2, DWORD secuLevel, BOOL* matched)

Compares two sets of minutiae data， which can be of diffrent template formats (SG400,ANSl378, ISO19794-2,or ISO19794-2 Compact).It returns TRUE or FALSE as a matching result (matched).The security level (secuLevel affects matching result and may be adjusted according to the security policy required by the user or organization.

# . Parameters

hFpm

The handle of the SGFPM object

minTemplate1

A pointer to the bufer containing minutiae data extracted from a fingerprint image

templateType1

Specifies format of minTemplate1 (TEMPLATE_FORMAT_SG400,

TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,or

TEMPLATE_FORMAT_ISO19794_COMPACT)

sampleNum1

Position of a sample to be matched in minTemplate1. If templateType1 is

TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,or

TEMPLATE_FORMAT_ISO19794_COMPACT, it can have a value from 0 to the number of

samples minus 1 in minTemplate1. If templateType1 is TEMPLATE_FORMAT_SG400, this value is ignored.

# minTemplate2

A pointer to the bufer containing minutiae data extracted from a fingerprint image

# templateType2

Specifies format of minTemplate2 (TEMPLATE_FORMAT_SG400,

TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,0r

TEMPLATE_FORMAT_ISO19794_COMPACT)

# sampleNum2

Position of a sample to be matched in minTemplate2. If templateType2 is

TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,or

TEMPLATE_FORMAT_ISO19794_COMPACT, it can have a value from 0 to the number of samples minus 1 in minTemplate2.If templateType2 is TEMPLATE_FORMAT_SG400, this value is ignored.

# secuLevel

A security level as specified in “fplibnew.h” by one the following nine security levels:

SL_LOWEST, SL_LOWER, SL_LOW, SL_BELOW_NORMAL,SL_NORMAL(recOmmended),

SL_ABOVE_NORMAL,SL_HIGH,SL_HIGHER,and SL_HIGHEST.

# matched

TRUE: Same template

FALSE: Not same template

# Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in minTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in minTemplate2

DWORD SGFPM_GetMatchingScore(HSGFPM hFpm, BYTE* minTemplate1, BYTE* minTemplate2, DWORD* score)

Gets matching score of two sets of minutiae data of the same template format

# . Parameters

# hFpm

The handle of the SGFPM object

# minTemplate1

A pointer to the buffer containing minutiae data extracted from a fingerprint image

# minTemplate2

A pointer to the bufer containing minutiae data extracted from a fingerprint image

# score

Matching score (from O to 199)

# Returned values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE1= Error in minTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in minTemplate2

DWORD SGFPM_ GetMatchingScoreEx(HSGFPM hFpm, BYTE* minTemplate1, WORD templateType1, DWORD sampleNum1, BYTE* minTemplate2, WORD templateType2, DWORD sampleNum2, DWORD* score);

Gets matching score of two sets of minutiae data， which can be of diferent template formats (SG400, ANSI378, ISO19794-2,or ISO19794-2 COMPACT)

# ·Parameters

# hFpm

The handle of the SGFPM object

# minTemplate1

A pointer to the buffer containing minutiae data extracted from a fingerprint image

# templateType1

Specifies format of minTemplate1 (TEMPLATE_FORMAT_SG400,TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,orTEMPLATE_FORMAT_ISO19794_COMPACT)

# sampleNum1

Position of a sample to be matched in minTemplate1. If templateType1 is TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,or TEMPLATE_FORMAT_ISO19794_COMPACT, it can have a value from 0 to the number of samples minus 1 in minTemplate1. If templateType1 is TEMPLATE_FORMAT_SG400, this value is ignored.

# minTemplate2

A pointer to the buffer containing minutiae data extracted from a fingerprint image

# templateType2

Specifies format of minTemplate2 (TEMPLATE_FORMAT_SG400, TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,0r TEMPLATE_FORMAT_ISO19794_COMPACT)

# sampleNum2

Position of a sample to be matched in minTemplate2. If templateType2 is TEMPLATE_FORMAT_ANSI378,TEMPLATE_FORMAT_ISO19794,or TEMPLATE_FORMAT_ISO19794_COMPACT, it can have a value from 0 to the number of samples minus 1 in minTemplate2. If templateType2 is TEMPLATE_FORMAT_SG400, this value is ignored.

# score

Matching score (from 0 to 199)

# Returned values

SGFDX_ERROR_NONE = No error SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type SGFDX_ERROR_INVALID_TEMPLATE1= Error inminTemplate1 SGFDX_ERROR_INVALID_TEMPLATE2= Error in minTemplate2

# 4.6. Functions for ANSl378 Templates

DWORD SGFPM_GetTemplateSizeAfterMerge(HSGFPM hFpm, BYTE* ansiTemplate1, BYTE* ansiTemplate2, DWORD* size)

Calculates template size if two templates - ansiTemplate1 and ansiTemplate2 - are merged. Use this function to determine exact bufer size before using SGFPM_MergeAnsiTemplate().

# Parameters

# hFpm

The handle of the SGFPM object

# ansiTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# ansiTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# size

Template size if two templates are merged

# Return values

SGFDX_ERROR_NONE = No error SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type SGFDX_ERROR_INVALID_TEMPLATE1= Error inansiTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in ansiTemplate2

# DWORD SGFPM_MergeAnsiTemplate(HSGFPM hFpm, BYTE* ansiTemplate1, BYTE* ansiTemplate2, BYTE* outTemplate)

Merges two ANSl378 templates and returns a new merged template.The size of the merged template (outTemplate) willbe smaller than the sum of the sizes of the two input templates (size of ansiTemplate1 + size of ansiTemplate2). CallSGFPM_GetTemplateSizeAfterMerge() to determine the exact buffer size for outTemplate before callng SGFPM_MergeAnsiTemplate().

# . Parameters

hFpm

The handle of the SGFPM object

ansiTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

asniTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

outTemplate

The buffer containing merged data. The bufer should be assigned by the application. To

determine the exact buffer size, cal SGFPM_GetTemplateSizeAfterMerge().

# Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error inansiTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in ansiTemplate2

# DWORD SGFPM_MergeMultipleAnsiTemplate(HSGFPM hFpm, BYTE* inTemplates, DWORD nTemplates, BYTE* outTemplate)

Merges multiple ANSl378 templates and returns a new merged template.The size of the merged template (outTemplate) will be smaller than the sum of the sizes of all templates in inTemplates.

# . Parameters

hFpm

The handle of the SGFPM object

inTemplates

A series of ANSI378 templates [ANSITemplate-1, ANSITemplate-2,ANSITemplate-3.,.

ANSITemplate-n]

nTemplates

The number of templates in inTemplates

outTemplate

The buffer containing new merged template data. The buffer should be assigned by the application.

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

# DWORD SGFPM_GetAnsiTemplatelnfo(HSGFPM hFpm, BYTE* ansiTemplate, SGANSITemplatelnfo* templatelnfo)

Gets information of an ANSl378 template. Call this function before SGFPM_MatchAnsiTemplate() to obtain information about a template.

# . Parameters

hFpm

The handle of the SGFPM object

anisiTemplate

ANSl378 template

templatelnfo

The buffer that contains template information. For more information see SGANSITemplatelnfo structure.

Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

# DWORD SGFPM_MatchAnsiTemplate(HSGFPM hFpm, BYTE* ansiTemplate1, DWORD sampleNum1, BYTE* ansiTemplate2, DWORD sampleNum2, DWORD secuLevel, BOOL* matched)

Compares two sets of ANSl378 templates.It returns TRUE or FALSE as a matching result (matched). The security level (secuLevel) affects matching result and may be adjusted according to the security policy required by the user or organization.

. Parameters

hFpm

The handle of the SGFPM object

ansiTemplate1

A pointer to the buffer containing minutiae data. A template can have more than one sample.

sampleNum1

Position of sample to be matched in ansiTemplate1.It can be from O to the number of samples minus 1in ansiTemplate1

ansiTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample.

sampleNum2

Position of sample to be matched in ansiTemplate2. It can be from O to the number of samples minus 1in ansiTemplate2

secuLevel

A security level as specified in “fplibnew.h” by one the following nine security levels: SL_LOWEST, SL_LOWER, SL_LOW, SL_BELOW_NORMAL,SL_NORMAL (reCOmmended), SL_ABOVE_NORMAL,SL_HIGH,SL_HIGHER and SL_HIGHEST.

matched

TRUE: Same template

FALSE: Not same template

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in ansiTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in ansiTemplate2

# DWORD SGFPM_GetAnsiMatchingScore(HSGFPM hFpm, BYTE* ansiTemplate1, DWORD sampleNum1, BYTE* ansiTemplate2, DWORD sampleNum2, DWORD* score)

Gets matching score

. Parameters

hFpm

The handle of the SGFPM object

ansiTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

sampleNum1

Position of sample to be matched in ansiTemplate1.It can be from O to the number of samples minus 1 in ansiTemplate1

# ansiTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in ansiTemplate2. It can be from O to the number of samples minus 1 in ansiTemplate2

# score

Matching score (from 0 to 199)

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in ansiTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2 = Error in ansiTemplate2

# 4.7. Functions for ISO19794-2 Templates

# DWORD SGFPM_GetlsoTemplateSizeAfterMerge(HSGFPM hFpm, BYTE* isoTemplate1, BYTE* isoTemplate2, DWORD* size)

Calculates template size if two templates-isoTemplate1 and isoTemplate2-are merged. Use this function to determine exact buffer size before using SGFPM_MergelsoTemplate().

# 1 Parameters

# hFpm

The handle of the SGFPM object

# isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# isoTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample.

# size

Template size if two templates are merged

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# DWORD SGFPM_MergelsoTemplate(HSGFPM hFpm, BYTE* isoTemplate1, BYTE* isoTemplate2, BYTE* outTemplate)

Merges two ISO19794-2 templates and returns a new merged template.The size of the merged template (outTemplate)willbe smaler than the sum of the sizes of the two input templates (size of isoTemplate1 + size of isoTemplate2). Cal SGFPM_GetlsoTemplateSizeAfterMerge() to determine the exact buffer size for outTemplate before calling SGFPM_MergelsoTemplate().

# . Parameters

# hFpm

The handle of the SGFPM object

# isoTemplate1

A pointer to the buffer containing minutiae data. A template can have more than one sample.

# isoTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample.

# outTemplate

The bufer containing merged data. The buffer should be assigned by the application. To determine the exact buffer size, call SGFPM_GetlsoTemplateSizeAfterMerge().

# Return values

```txt
SGFDX_ERROR_NONE = No error  
SGFDX_ERROR_INVALID_template_TYPE = Wrong template type  
SGFDX_ERROR_INVALID_template1 = Error in isoTemplate1  
SGFDX_ERROR_INVALID_template2 = Error in isoTemplate2 
```

# DWORD SGFPM_MergeMultiplelsoTemplate(HSGFPM hFpm, BYTE* inTemplates, DWORD nTemplates, BYTE* outTemplate)

Merges multiple ISO19794-2 templates and returns a new merged template. The size of the merged template (outTemplate) willbe smaller than te sum of the sizes of a templates in inTemplates.

# Parameters

hFpm

The handle of the SGFPM object

# inTemplates

A series of ISO19794-2 templates [ISOTemplate-1, ISOTemplate-2, ISOTemplate-.,. ISOTemplate-n]

# nTemplates

The number of templates in inTemplates

# outTemplate

The buffer containing new merged template data. The buffer should be assigned by the application.

# Return values

SGFDX_ERROR_NONE = No error

SGFDX ERROR INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

# DWORD SGFPM_GetlsoTemplatelnfo(HSGFPM hFpm, BYTE* isoTemplate, SGISOTemplatelnfo* templatelnfo)

Gets information of an ISO19794-2 template. Callthis function before SGFPM_MatchlsoTemplate() to obtain information about a template.

# . Parameters

hFpm

The handle of the SGFPM object

# isoTemplate

ISO19794-2 template

# templatelnfo

The buffer that contains template information. For more information see SGlsOTemplatelnfo structure.

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_PARAM = Invalid parameter used

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

# DWORD SGFPM_MatchlsoTemplate(HSGFPM hFpm, BYTE* isoTemplate1, DWORD sampleNum1, BYTE* isoTemplate2, DWORD sampleNum2, DWORD secuLevel, BOOL* matched)

Compares two sets of ISO19794-2 templates. It returns TRUE or FALSE as a matching result (matched). The security level (secuLevel) affects matching result and may be adjusted according to the security policy required by the user or organization.

# . Parameters

hFpm

The handle of the SGFPM object

# isoTemplate1

A pointer to the buffer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in isoTemplate1. It can be from O to the number of samples minus 1 in isoTemplate1

# isoTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in isoTemplate2. It can be from O to the number of samples minus 1 in isoTemplate2

# secuLevel

A security level as specified in “fplibnew.h” by one the following nine security levels: SL_LOWEST, SL_LOWER, SL_LOW,SL_BELOW_NORMAL,SL_NORMAL (reCOmmended), SL_ABOVE_NORMAL,SL_HIGH, SL_HIGHER and SL_HIGHEST.

# matched

TRUE: Same template

FALSE: Not same template

# Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# DWORD SGFPM_GetlsoMatchingScore(HSGFPM hFpm, BYTE* isoTemplate1, DWORD sampleNum1, BYTE*isoTemplate2, DWORD sampleNum2, DWORD* score)

Gets matching score

# . Parameters

# hFpm

The handle of the SGFPM object

# isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum1

Position of sample to be matched in isoTemplate1. It can be from O to the number of samples minus 1in isoTemplate1

# isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

# sampleNum2

Position of sample to be matched in isoTemplate2.It can be from O to the number of samples minus 1 in isoTemplate2

# score

Matching score (from O to 199)

# Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Eror in isoTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2 = Error in isoTemplate2

# 4.8. Functions for ISO19794-2 Compact Card Templates6

DWORD SGFPM_GetlsoCompactTemplateSizeAfterMerge(HSGFPM hFpm, BYTE* isoTemplate1, BYTE* isoTemplate2, DWORD* size)

Calculates template size if two templates-isoTemplate1 and isoTemplate2-are merged. Use this function to determine exact buffer size before using SGFPM_MergelsoCompactTemplate().

. Parameters

hFpm

The handle of the SGFPM object

isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

size

Template size if two templates are merged

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR INVALID_TEMPLATE1= Error in isoTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# DWORD SGFPM_MergelsoCompactTemplate(HSGFPM hFpm, BYTE* isoTemplate1, BYTE* isoTemplate2, BYTE* outTemplate)

Merges two ISO19794-2 compact card templates and returns a new merged template. The size of the merged template (outTemplate) willbe smaller than the sum of the sizes of the two input templates (size of isoTemplate1 + size of isoTemplate2). Call SGFPM_GetlsoCompactTemplateSizeAfterMerge() to determine the exact buffer size for outTemplate before caling SGFPM_MergelsoCompactTemplate().

. Parameters

hFpm

The handle of the SGFPM object

isoTemplate1

A pointer to the buffer containing minutiae data. A template can have more than one sample.

isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

outTemplate

The buffer containing merged data. The buffer should be assigned by the application. To determine the exact bufer size, call SGFPM_GetlsoCompactTemplateSizeAfterMerge().

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2 = Error in isoTemplate2

# DWORD SGFPM_MergeMultiplelsoCompactTemplate(HSGFPM hFpm, BYTE* inTemplates, DWORD nTemplates, BYTE* outTemplate)

Merges multiple ISO19794-2 compact card templates and returns a new merged template. The size of the merged template (outTemplate) willbe smaller than the sum of the sizes of alltemplates in inTemplates.

# . Parameters

hFpm

The handle of the SGFPM object

inTemplates

A series of ISO19794-2 compact card templates [ISOTemplate-1, ISOTemplate-2, ISOTemplate-3,., ISOTemplate-n]

nTemplates

The number of templates in inTemplates

outTemplate

The bufer containing new merged template data. The buffer should be assigned by the application.

Return values

SGFDX_ERROR_NONE = No error SGFDX_ERROR_INVALID_PARAM = Invalid parameter used SGFDX_ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

# DWORD SGFPM_GetlsoCompactTemplatelnfo(HSGFPM hFpm, BYTE* isoTemplate, SGISOTemplatelnfo* templatelnfo)

Getsinformation ofan ISO19794-2 compact card template. Call thisfunctionbefore SGFPM_MatchlsoCompactTemplate( to obtain information about a template.

.Parameters

hFpm

The handle of the SGFPM object

isoTemplate

ISO19794-2 compact card template

templatelnfo

The buffer that contains template information. For more information, see SGlsOTemplatelnfo structure.

Return values

SGFDX_ERROR_NONE = No error SGFDX_ERROR_INVALID_PARAM= Invalid parameter used SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

# DWORD SGFPM_MatchlsoTemplate(HSGFPM hFpm, BYTE* isoTemplate1, DWORD sampleNum1, BYTE* isoTemplate2, DWORD sampleNum2, DWORD secuLevel, BOOL* matched)

Compares two sets of ISO19794-2 templates.It returns TRUE or FALSE as a matching result (matched). The security level (secuLevel) affects matching result and may be adjusted according to the security policy required by the user or organization.

. Parameters

hFpm

The handle of the SGFPM object

isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

sampleNum1

Position of sample to be matched in isoTemplate1. It can be from 0 to the number of samples minus 1 in isoTemplate1

isoTemplate2

A pointer to the buffer containing minutiae data. A template can have more than one sample.

sampleNum2

Position of sample to be matched in isoTemplate2.It can be from O to the number of samples minus 1 in isoTemplate2

secuLevel

A security level as specified in “sgfplib.h" by one the folowing nine security levels: SL_LOWEST,

SL_LOWER,SL_LOW，.SL_BELOW_NORMAL，SL_NORMAL(rec0mmended), SL_ABOVE_NORMAL,SL_HIGH,SL_HIGHER and SL_HIGHEST.

matched

TRUE: Same template

FALSE: Not same template

Return values

SGFDX ERROR NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE = Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

DWORD SGFPM_GetlsoMatchingScore(HSGFPM hFpm, BYTE* isoTemplate1, DWORD sampleNum1, BYTE*isoTemplate2, DWORD sampleNum2, DWORD* score)

Gets matching score

. Parameters

hFpm

The handle of the SGFPM object

isoTemplate1

A pointer to the bufer containing minutiae data. A template can have more than one sample.

sampleNum1

Position of sample to be matched in isoTemplate1.It can be from O to the number of samples minus 1 in isoTemplate1

isoTemplate2

A pointer to the bufer containing minutiae data. A template can have more than one sample.

sampleNum2

Position of sample to be matched in isoTemplate2.It can be from 0 to the number of samples minus 1 in isoTemplate2

score

Matching score (from O to 199)

Return values

SGFDX_ERROR_NONE = No error

SGFDX_ERROR_INVALID_TEMPLATE_TYPE= Wrong template type

SGFDX_ERROR_INVALID_TEMPLATE1= Error in isoTemplate1

SGFDX_ERROR_INVALID_TEMPLATE2= Error in isoTemplate2

# 4.9. Other

DWORD SGFPM_GetMinexVersion(HSGFPM hFpm, DWORD *extractor, DWORD* matcher))

Gets version of MINEX Compliant algorithms used in this SDK

. Parameters

hFpm

The handle of the SGFPM object

extractor

Version of MINEX Compliant extractor (template generator)

matcher

Version of MINEX Compliant matcher (template matcher)

Return values

SGFDX_ERROR_NONE = No error

# Chapter 5. Structure Reference

# 5.1. SGDevicelnfoParam

```c
typedef struct tagSGDeviceInfoParam   
{ DWORD DeviceID; // 0 -9 BYTE DeviceSN[SGDEV_SN_LEN+1]; // Device serial number, SN length = 15  
DWORD ComPort; // USB readers => USB (0x3BC+1)  
DWORD ComSpeed; // USB reader => 0  
DWORD ImageWidth; // Image width  
DWORD ImageHeight; // Image height  
DWORD Contrast; // 0 ~ 100  
DWORD Brightness; // 0 ~ 100  
DWORD Gain; // Device dependent  
DWORD ImageDPI; // Image resolution  
DWORD FWVersion; // Firmware version} SGDeviceInfoParam; 
```

# Description

Used when calling SGFPM_GetDevicelnfo()

# Members

```txt
DeviceID Device ID for USB readers only (0 - 9)  
DeviceSN Device serial number for USB readers. SGDEV_SN_LEN = 15  
ComPort Contains DeviceID for USB readers  
ComSpeed Not used  
ImageWidth Fingerprint image width in pixels  
ImageHeight Fingerprint image height in pixels  
Brightness Current brightness value (0-100)  
Contrast Current contrast value (0-100)  
Gain Amplification (1, 2, 4, or 8) of image brightness (a higher value yields darker images)  
ImageDPI Fingerprint image resolution in DPI  
FWVersion Device firmware version number for USB readers 
```

# 5.2. SGDevicelnfo

```c
define SGDEV_NAME_LEN 15  
#define SGDEV_ID_LEN 63  
typedef struct tagSGDeviceInfo  
{  
    char_t Name[SGDEV_NAME_LEN + 1]; // null-terminated wide string  
    char_t ID[SGDEV_ID_LEN + 1]; // null-terminated wide string  
} SGDeviceInfo, *LPSGDeviceInfo; 
```

# Description

Used when calling SGFPM_FindDevices()

# Members

Name Device name for U20-ASF-BT (BLE) devices

ID Device ID for U20-ASF-BT (BLE) devices

# 5.3. SGDeviceList

```txt
typedef struct tagSGDeviceList  
{  
    DWORD DevName;  
    DWORD DevID;  
    WORD DevType;  
    BYTE DevSN[SGDEV_SN_LEN + 1];  
} SGDeviceList; 
```

# Description

Used to obtain the currently attached device list in SGFPM_EnumerateDevice()

# Members

DevName Device name (for example: SG_DEV_FDU05 for U20 or SG_DEV_FDU07 for U10)

DevID Device ID for USB readers

DevType Not used

DeviceSN Device serial number for USB readers (SGDEV_SN_LEN = 15)

# 5.4. SGFingerlnfo

```objectivec
typedef struct tagSGFingerInfo {
    WORD FingerNumber;
    WORD ViewNumber;
    WORD ImpressionType;
    WORD ImageQuality;
} SGFingerInfo; 
```

# Description

Used when caling SGFPM_CreateTemplate().The provided information willbe put into the template. For ANSl378 or ISO 19794-2 templates,this information can be seen from the template structure format.

For SG400 templates, this information cannot be seen in the template.

# Members

FingerNumber

```txt
Finger position number Finger SG_FINGPOS_UK (0x00): Unknown finger SG_FINGPOS_RT (0x01): Right thumb SG_FINGPOS_RI (0x02): Right index finger SG_FINGPOS_RM (0x03): Right middle finger SG_FINGPOS_RR (0x04): Right ring finger SG_FINGPOS_RL (0x05): Right little finger SG_FINGPOS_LT (0x06): Left thumb SG_FINGPOS_LI (0x07): Left index finger SG_FINGPOS_LM (0x08): Left middle finger SG_FINGPOS_LR (0x09): Left ring finger SG_FINGPOS_LL (0x0A): Left little finger 
```

# ViewNumber

Sample number for each finger (starts at 0)

# ImpressionType

Impression type (should be O for SecuGen readers)

SG_IMPTYPE_LP (0x00): Live-scan plain

SG_IMPTYPE_LR (0X01): Live-scan rolled

SG_IMPTYPE_NP (0X02): Non-live-scan plain

SG_IMPTYPE_NR (0x03): Non-live-scan rolled

# ImageQuality

Image quality value (0- 10o). To get an image quality, use GetlmageQuality().

# 5.5. SGANSITemplatelnfo/SGISOTemplatelnfo

typedef struct tagSGANSITemplateInfo {

DWORD TotalSamples;

SGFingerInfo SampleInfo[225];

}SGANSITemplateInfo， SGISOTemplateInfo;

# Description

Used when caling SGFPM_GetAnsiTemplatelnfo() or SGFPM_GetlsoTemplatelnfo().The provided information will be put into the template. For ANSl378 templates,this information can be seen from the template structure format. For SG400 templates,this information cannot be seen in the template. For ISO19794-2 templates,this information can be seen from the template structure format.

# Members

# TotalSamples

Indicates the number of samples in a template. One template can have a maximum of 225 samples. Number of samples = Max finger number 15 *Max View Number 15 = 225

# Samplelnfo

Information of each sample in a template. Refer to SGFingerlnfo structure.

# Chapter 6. Constants

# 6.1. SGFDxDeviceName

![](images/2554b57f4716bc041ddb0a698beaa4a52f31194019c02cbe7ae8f2f2118699ef.jpg)

# 6.2. SGPPPortAddr

![](images/8542c67732f5924e587d8e6f17f529fddff50610e5ae2222a4cdc1b005d0aa2b.jpg)

# 6.3. SGFDxSecurityLevel

![](images/24fcac59f75d49a560fff565c60118c96885a2153f392c58b7fc7c949aeea82b.jpg)

# 6.4. SGFDxTemplateFormat

![](images/7334979d8f916d5bcf6621ca15b3f08fa9521e93586bcd1404b9568953f8fdb8.jpg)

# 6.5. SGlmpressionType

![](images/00d9055a62c1df6f3a304b519dd7ae8fe29136838a134e0718601ccc35bba54c.jpg)

# 6.6. SGFingerPosition

![](images/c455e345880998cd8b4d8f99407d1cc344ca0aaad87307caacd595f5c2e644fb.jpg)

# 6.7. SGFDxErrorCode

![](images/cdca506002c4cdadd394ffbcf5150ff6542526b31b75fe8cfb1dfbed08699a74.jpg)
(*Fake detection functions currently only available for U20-based device.)

![](images/eb09a136bed5f4ba7819a1ce505af8dad40dec4333bc8e2eca199549e888aa55.jpg)

![](images/93899ea5f436ca3727aeb34989b346696de8a56859f5c40eb07f521adb32829b.jpg)

![](images/ee7fdd4dde747b1746d083bd8506bf307d68d27f1411640fed612de8d0d56bf1.jpg)

# 6.8. Other Constants

·SGDEV_SN_LEN 15// Device serial number length   
WM_APP_SGAUTOONEVENT Ox8100   
SGDEVEVNET_FINGER_OFF 0  
SGDEVEVNET_FINGER_ON   
SGDEV_NAME_LEN 15 // Device name length   
SGDEV_ID_LEN 63// Device ID length

# Appendix A. Using SGFPM Objects Directly

All SDK functions are integrated into the SGFPM class. To access the SGFPM class (not by handle)， get the pointer of an SGFPM object using CreateSGFPMObject(). When you have finished using the SGFPM object, destroy the SGFPM object using DestroySGFPMObject().

# A.1. Creating an SGFPM object

To get a pointer to an SGFPM object, use CreateSGFPMObject().To create and use the SGFPM object, it should be called.

SGFPM \*g_Fpm; // SGFPM object pointer   
DWORD err $=$ CreateSGFPMObject(&g_Fpm);   
if (err != SGFDX_ERROR_NONE) g_Fpm->Init(SG_DEV_FDU05);

# A.2. Destroying an SGFPM object

When exiting a program, you must destroy the SGFPM object with DestroySGFPMObject().

```objectivec
DestroySGFPMObject(g_Fpm); // Destroys SGFPM object 
```

# A.3. Accessing other member functions

All member functions are nearly the same as the functions in the C style APls described in Chapter 3.The only difference is that functions are accessed through object pointers, not handles.

```cpp
g_Fpm->Init(devName);   
g_Fpm->InitEx2(width, height, dpi, path_tolicense_file);   
g_Fpm->SetTemplateFormat.format) // Default format is SG400   
g_Fpm->EnumerateDevice(ndvs, devList)   
g_Fpm->OpenDevice(devId)   
g_Fpm->CloseDevice()   
g_Fpm->GetDeviceInfo(pDeviceInfo)   
g_Fpm->Configure(hwnd)   
g_Fpm->SetBrightness(brightness)   
g_Fpm->SetLedOn(onoff)   
g_Fpm->GetImage(buffer)   
g_Fpm->GetImageEx(buffer, time = 0, dispWnd, quality)   
g_Fpm->GetImageQuality(width, height, imgBuf, quality)   
g_Fpm->EnableAutoOnEvent(enable, hwnd, reserved)   
g_Fpm->GetMaxTemplateSize(size)   
g_Fpm->CreateTemplate(fpInfo, rawImage, minTemplate)   
g_Fpm->GetTemplateSize(buf, size)   
g_Fpm->MatchTemplate(minTemplate1, minTemplate2, secuLevel, matched) 
```

```c
g_Fpm->GetMatchingScore(min1, min2, score)  
g_Fpm->GetTemplateSizeAfterMerge(ansiTemplate1,ansiTemplate2, size)  
g_Fpm->MergeAnsiTemplate(ansiTemplate1,ansiTemplate2,outTemplate)  
g_Fpm->MergeMultipleAnsiTemplate(inTemplates, nTemplates,outTemplate)  
g_Fpm->GetAnsiTemplateInfo(BYTE\*ansiTemplate,SGANSITemplateInfo\* templateInfo)  
g_Fpm->MatchAnsiTemplate(ansiTemplate1,sampleNum1,ansiTemplate2,sampleNum2,secuLevel,matched)  
g_Fpm->GetAnsiMatchingScore(ansiTemplate1,sampleNum1,ansiTemplate2,sampleNum2, score)  
g_Fpm->MatchTemplateEx(minTemplate1, templateType1,sampleNum1,minTemplate2,templateType2,sampleNum2,secuLevel,matched)  
g_Fpm->GetMatchingScoreEx(minTemplate1, templateType1,sampleNum1,minTemplate2,templateType2,sampleNum2, score)  
g_Fpm->GetMinexVersion(extractor, matcher) 
```

// ISO19794-2   
```cpp
g_Fpm->MergeIsoTemplate(isoTemplate1, isoTemplate2, outTemplate)  
g_Fpm->MergeMultipleIsoTemplate(inTemplates, nTemplates, outTemplate)  
g_Fpm->GetIsoTemplateInfo(isoTemplate, templateInfo)  
g_Fpm->MatchIsoTemplate(isoTemplate1, sampleNum1, isoTemplate2, sampleNum2, secuLevel, matched)  
g_Fpm->GetIsoMatchingScore(isoTemplate1, sampleNum1, isoTemplate2, sampleNum2, score) 
```

// ISO19794-2 Compact Card Template   
```cpp
g_Fpm->MergeIsoCompactTemplate(isoTemplate1, isoTemplate2, outTemplate)  
g_Fpm->MergeMultipleIsoCompactTemplate(inTemplates, nTemplates, outTemplate)  
g_Fpm->GetIsoCompactTemplateInfo(isoTemplate, templateInfo)  
g_Fpm->MatchIsoCompactTemplate(isoTemplate1, sampleNum1, isoTemplate2, sampleNum2, secuLevel, matched)  
g_Fpm->GetIsoCompactMatchingScore(isoTemplate1, sampleNum1, isoTemplate2, sampleNum2, score) 
```

// U20-ASF-BT (Bluetooth SPP and BLE)   
```c
g_Fpm->CreateTemplateDev(outSize);  
g_Fpm->GetTemplateDev(outTemplate);  
g_Fpm->GetTemplateFormatDev(outFormat);  
g_Fpm->SetTemplateFormatDev(inFormat); 
```

// U20-ASF-BT (Bluetooth BLE) only   
```txt
g_Fpm->FindDevices(&ndevs, &devList, timeout);  
g_Fpm->CancelFind;  
g_Fpm->OpenDevice2(devId); 
```

# Appendix B.Using .NET Library

For information about usage and programming using SecuGen's.NET library, please refer to the separate document: FDx SDK Pro .NET Programming Manual.

# Appendix C. Getting a Template from Biuetooth Devices (U20-ASF-BT)

Due to the data size of afingerprint image,itcan take longer to transfer afingerprint image wirelessy from U20-ASF-BT Bluetooth devices than it would to transfer from USB devices connected to the host.Therefore, for faster performance,it is recommended to transfer fingerprint templates, which have much smaler data size,instead of the images.Among several built-in capabities, U20-ASF-BT Bluetooth devices can perform image capture, image processing,and template generation within the device.

```cpp
/*   
\* template formats for SDA   
*/   
#define TEMPLATE_ANSI378 0x0100   
#define TEMPLATE_SG400 0x0200 // default   
#define TEMPLATE_ISO19794_2 0x0300   
void get_template(HSGFPM hFPM, WORD format) {   
DWORD dwErr = SGFDX_ERROR_NONE;   
// get the current template format   
WORD current_template_format = 0;   
dwErr = SGFPM_GetTemplateFormatDev(hFPM, &current_template_format);   
assert(dwErr == SGFDX_ERROR_NONE);   
// set template   
WORD template_format = format;   
dwErr = SGFPM_SetTemplateFormatDev(hFPM, template_format);   
assert(dwErr == SGFDX_ERROR_NONE);   
std::cout << "current template format=0x" << std::hex << current_template_for   
mat << ", new template format=0x" << template_format << std::endl;   
// capture and create a template   
DWORD template_size = 0;   
dwErr = SGFPM_CreateTemplateDev(hFPM, &template_size);   
assert(dwErr == SGFDX_ERROR_NONE);   
assert/template_size > 0);   
// get template data   
if (template_size > 0) { char *template_data = new char[template_size]; 
```

```cpp
dwErr = SGFPM_GetTemplateDev(hFPM, (BYTE*) template_data); assert(dwErr == SGFDX_ERROR_NONE); save_template/template_data, template_size, template_format); delete[] template_data; } } /* * main */ int main() { DWORD rc = SGFDX_ERROR_NONE; HSGFPM hFPM = NULL; // Create a SGFPM object rc = SGFPM_Create(&hFPM); if (rc != SGFDX_ERROR_NONE) { std::cout << "ERR: SGFPM_Create returns" << rc << std::endl; } else { // Initialize the SGFPM Object rc = SGFPM_Init(hFPM, SG_DEV_FDUSDA); // or SG_DEV_FDUSDA_BLE if (rc != SGFDX_ERROR_NONE) { std::cout << "ERR: SGFPM_Init returns" << rc << std::endl; } else { Int comport = 6; rc = SGFPM_OpenDevice(hFPM, comport); // U20-ASF-BT BLE device: BT-3175 /* std::wstring id = { L"BluetoothLE#BluetoothLEac:d1:b8:d0:d6:e4-cc:35:5a:ff:f0:37"}; rc = SGFPM_OpenDevice2(hFPM, (wchar_t*)id.c_str()); } if (rc != SGFDX_ERROR_NONE) { std::cout << "ERR: SGFPM_OpenDevice returns" << rc << std::endl; } else { get_template(hFPM, TEMPLATE_SG400); // Close the device SGFPM_CloseDevice(hFPM); } 
```

```txt
}   
}   
// Destory the SGFPM object SGFPM_Terminate(hFPM); 
```
