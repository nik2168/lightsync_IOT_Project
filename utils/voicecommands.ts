// import { Dispatch } from "@reduxjs/toolkit";
// import {
//   toggleRedLed,
//   toggleGreenLed,
//   toggleYellowLed,
//   toggleAllLights,
// } from "@/redux/lightSyncSlice";

// // Define types
// export interface CommandPattern {
//   patterns: RegExp[];
//   action: () => void;
// }

// interface VoiceCommandParams {
//   dispatch: Dispatch;
//   socket: any;
//   temperature: number;
//   humidity: number;
//   motionDetected: boolean;
//   motionAlerts: any[];
//   speakResponse: (text: string) => void;
// }

// // ✅ English + Hinglish + Pure Hindi
// export const createVoiceCommands = ({
//   dispatch,
//   socket,
//   temperature,
//   humidity,
//   motionDetected,
//   motionAlerts,
//   speakResponse,
// }: VoiceCommandParams): CommandPattern[] => [
//   // ================ LAMP 1 / RED LED COMMANDS ================
//   {
//     patterns: [
//       // English
//       /turn on lamp 1/i,
//       /switch on lamp 1/i,
//       /lamp 1 on/i,
//       /enable lamp 1/i,
//       /activate lamp 1/i,
//       /turn on the lamp 1/i,
//       /turn on the lamp one/i,
//       /turn on lamp one/i,
//       /switch on lamp one/i,
//       /lamp one on/i,
//       /enable lamp one/i,
//       /activate lamp one/i,
//       /turn the first lamp on/i,
//       /switch the first lamp on/i,
//       /first lamp on/i,
//       /red lamp on/i,
//       /red light on/i,
//       /turn on red lamp/i,
//       /switch on red light/i,
//       /light up lamp 1/i,
//       /light up lamp one/i,
//       /start lamp 1/i,
//       /start lamp one/i,

//       // Hinglish
//       /lamp ek chalu karo/i,
//       /pehli batti jalao/i,
//       /lal batti chalu karo/i,

//       // Hindi
//       /लैम्प 1 चालू करो/i,
//       /लैम्प एक चालू करो/i,
//       /पहली बत्ती जलाओ/i,
//       /लाल बत्ती चालू करो/i,
//       /लाल लाइट ऑन करो/i,
//     ],
//     action: () => {
//       dispatch(toggleRedLed());
//       socket.emit("toggleRedLed", { redLedState: true });
//       speakResponse("Lamp 1 turned on");
//     },
//   },
//   {
//     patterns: [
//       // English
//       /turn off lamp 1/i,
//       /switch off lamp 1/i,
//       /lamp 1 off/i,
//       /disable lamp 1/i,
//       /deactivate lamp 1/i,
//       /turn off the lamp 1/i,
//       /turn off lamp one/i,
//       /switch off lamp one/i,
//       /lamp one off/i,
//       /disable lamp one/i,
//       /deactivate lamp one/i,
//       /turn off the lamp one/i,
//       /turn the first lamp off/i,
//       /switch the first lamp off/i,
//       /first lamp off/i,
//       /red lamp off/i,
//       /red light off/i,
//       /turn off red lamp/i,
//       /switch off red light/i,
//       /shut off lamp 1/i,
//       /shut off lamp one/i,
//       /stop lamp 1/i,
//       /stop lamp one/i,

//       // Hinglish
//       /lamp ek band karo/i,
//       /pehli batti bujha do/i,
//       /lal batti band karo/i,

//       // Hindi
//       /लैम्प 1 बंद करो/i,
//       /लैम्प एक बंद करो/i,
//       /पहली बत्ती बुझा दो/i,
//       /लाल बत्ती बंद करो/i,
//       /लाल लाइट ऑफ करो/i,
//     ],
//     action: () => {
//       dispatch(toggleRedLed());
//       socket.emit("toggleRedLed", { redLedState: false });
//       speakResponse("Lamp 1 turned off");
//     },
//   },

//   // ================ LAMP 2 / YELLOW LED COMMANDS ================
//   {
//     patterns: [
//       // English
//       /turn on lamp 2/i,
//       /switch on lamp 2/i,
//       /lamp 2 on/i,
//       /enable lamp 2/i,
//       /activate lamp 2/i,
//       /turn on the lamp 2/i,
//       /turn on lamp two/i,
//       /switch on lamp two/i,
//       /lamp two on/i,
//       /enable lamp two/i,
//       /activate lamp two/i,
//       /turn on the lamp two/i,
//       /turn the second lamp on/i,
//       /switch the second lamp on/i,
//       /second lamp on/i,
//       /yellow lamp on/i,
//       /yellow light on/i,
//       /turn on yellow lamp/i,
//       /switch on yellow light/i,
//       /light up lamp 2/i,
//       /light up lamp two/i,
//       /start lamp 2/i,
//       /start lamp two/i,

//       // Hinglish
//       /lamp do chalu karo/i,
//       /dusri batti jalao/i,
//       /peeli batti chalu karo/i,

//       // Hindi
//       /लैम्प 2 चालू करो/i,
//       /लैम्प दो चालू करो/i,
//       /दूसरी बत्ती जलाओ/i,
//       /पीली बत्ती चालू करो/i,
//       /पीली लाइट ऑन करो/i,
//     ],
//     action: () => {
//       dispatch(toggleYellowLed());
//       socket.emit("toggleYellowLed", { yellowLedState: true });
//       speakResponse("Lamp 2 turned on");
//     },
//   },
//   {
//     patterns: [
//       // English
//       /turn off lamp 2/i,
//       /turn off the lamp 2/i,
//       /switch off lamp 2/i,
//       /lamp 2 off/i,
//       /disable lamp 2/i,
//       /deactivate lamp 2/i,
//       /turn off lamp two/i,
//       /switch off lamp two/i,
//       /lamp two off/i,
//       /disable lamp two/i,
//       /deactivate lamp two/i,
//       /turn off the lamp two/i,
//       /turn the second lamp off/i,
//       /switch the second lamp off/i,
//       /second lamp off/i,
//       /yellow lamp off/i,
//       /yellow light off/i,
//       /turn off yellow lamp/i,
//       /switch off yellow light/i,
//       /shut off lamp 2/i,
//       /shut off lamp two/i,
//       /stop lamp 2/i,
//       /stop lamp two/i,

//       // Hinglish
//       /lamp do band karo/i,
//       /dusri batti bujha do/i,
//       /peeli batti band karo/i,

//       // Hindi
//       /लैम्प 2 बंद करो/i,
//       /लैम्प दो बंद करो/i,
//       /दूसरी बत्ती बुझा दो/i,
//       /पीली बत्ती बंद करो/i,
//       /पीली लाइट ऑफ करो/i,
//     ],
//     action: () => {
//       dispatch(toggleYellowLed());
//       socket.emit("toggleYellowLed", { yellowLedState: false });
//       speakResponse("Lamp 2 turned off");
//     },
//   },

//   // ================ FAN / GREEN LED COMMANDS ================
//   {
//     patterns: [
//       // English
//       /turn on fan/i,
//       /switch on fan/i,
//       /turn on the fan/i,
//       /fan on/i,
//       /start fan/i,
//       /start the fan/i,
//       /activate fan/i,
//       /enable fan/i,
//       /turn the fan on/i,
//       /switch the fan on/i,
//       /power on fan/i,
//       /power up fan/i,
//       /green light on/i,
//       /green lamp on/i,
//       /turn on green light/i,
//       /get the fan going/i,
//       /fire up the fan/i,
//       /spin the fan/i,
//       /turn on air/i,
//       /start air circulation/i,

//       // Hinglish
//       /pankha chalu karo/i,
//       /hawa chalu karo/i,
//       /green light on karo/i,

//       // Hindi
//       /पंखा चालू करो/i,
//       /हवा चालू करो/i,
//       /हरी बत्ती चालू करो/i,
//     ],
//     action: () => {
//       dispatch(toggleGreenLed());
//       socket.emit("toggleGreenLed", { greenLedState: true });
//       speakResponse("Fan turned on");
//     },
//   },
//   {
//     patterns: [
//       // English
//       /turn off fan/i,
//       /switch off fan/i,
//       /turn off the fan/i,
//       /fan off/i,
//       /stop fan/i,
//       /stop the fan/i,
//       /deactivate fan/i,
//       /disable fan/i,
//       /turn the fan off/i,
//       /switch the fan off/i,
//       /power off fan/i,
//       /power down fan/i,
//       /green light off/i,
//       /green lamp off/i,
//       /turn off green light/i,
//       /shut off fan/i,
//       /shut down fan/i,
//       /kill the fan/i,
//       /turn off air/i,
//       /stop air circulation/i,

//       // Hinglish
//       /pankha band karo/i,
//       /hawa band karo/i,
//       /green light off karo/i,

//       // Hindi
//       /पंखा बंद करो/i,
//       /हवा बंद करो/i,
//       /हरी बत्ती बंद करो/i,
//     ],
//     action: () => {
//       dispatch(toggleGreenLed());
//       socket.emit("toggleGreenLed", { greenLedState: false });
//       speakResponse("Fan turned off");
//     },
//   },

//   // ================ ALL DEVICES COMMANDS ================
//   {
//     patterns: [
//       // English
//       /turn on everything/i,
//       /switch on everything/i,
//       /everything on/i,
//       /turn on all devices/i,
//       /turn all device on/i,
//       /all on/i,
//       /all devices on/i,
//       /turn on all/i,
//       /switch on all/i,
//       /all lights on/i,
//       /turn on all lights/i,
//       /switch on all lights/i,
//       /all lamps on/i,
//       /turn on all lamps/i,
//       /lights on/i,
//       /lamps on/i,
//       /power on everything/i,
//       /power up everything/i,
//       /activate all/i,
//       /enable all/i,
//       /start everything/i,
//       /light up the house/i,
//       /light up everything/i,
//       /turn it all on/i,
//       /full power/i,

//       // Hinglish
//       /sab kuch chalu karo/i,
//       /sab lights on karo/i,
//       /ghar ki sari roshni jalao/i,

//       // Hindi
//       /सब कुछ चालू करो/i,
//       /सभी बत्तियां चालू करो/i,
//       /घर की सारी रोशनी जलाओ/i,
//       /सभी उपकरण चालू करो/i,
//     ],
//     action: () => {
//       dispatch(toggleAllLights());
//       socket.emit("toggleAllLights", { allLightsState: true });
//       speakResponse("All devices turned on");
//     },
//   },
//   {
//     patterns: [
//       // English
//       /turn off everything/i,
//       /switch off everything/i,
//       /turn off all devices/i,
//       /turn all devices off/i,
//       /everything off/i,
//       /all off/i,
//       /all devices off/i,
//       /turn off all/i,
//       /switch off all/i,
//       /all lights off/i,
//       /turn off all lights/i,
//       /switch off all lights/i,
//       /all lamps off/i,
//       /turn off all lamps/i,
//       /lights off/i,
//       /lamps off/i,
//       /power off everything/i,
//       /power down everything/i,
//       /deactivate all/i,
//       /disable all/i,
//       /stop everything/i,
//       /shut everything off/i,
//       /shut it all off/i,
//       /kill all lights/i,
//       /darkness/i,

//       // Hinglish
//       /sab kuch band karo/i,
//       /sab lights off karo/i,
//       /ghar andhera karo/i,

//       // Hindi
//       /सब कुछ बंद करो/i,
//       /सभी बत्तियां बंद करो/i,
//       /घर अंधेरा करो/i,
//       /सभी उपकरण बंद करो/i,
//     ],
//     action: () => {
//       dispatch(toggleAllLights());
//       socket.emit("toggleAllLights", { allLightsState: false });
//       speakResponse("All devices turned off");
//     },
//   },

//   // ================ TEMPERATURE QUERIES ================
//   {
//     patterns: [
//       // English
//       /what.*temperature/i,
//       /what's the temperature/i,
//       /whats the temperature/i,
//       /current temperature/i,
//       /room temperature/i,
//       /temp/i,
//       /how hot/i,
//       /how warm/i,
//       /how hot is it/i,
//       /how warm is it/i,
//       /temperature status/i,
//       /temperature reading/i,
//       /check temperature/i,
//       /tell me temperature/i,
//       /give me temperature/i,
//       /is it hot/i,
//       /is it warm/i,
//       /temperature please/i,

//       // Hinglish
//       /tapman kya hai/i,
//       /room ka temperature batao/i,
//       /kitni garmi hai/i,

//       // Hindi
//       /तापमान क्या है/i,
//       /कमरे का तापमान बताओ/i,
//       /कितनी गर्मी है/i,
//       /कमरे का सामान्य तापमान/i,
//     ],
//     action: () => {
//       speakResponse(`Current temperature is ${temperature} degrees celsius`);
//     },
//   },

//   // ================ HUMIDITY QUERIES ================
//   {
//     patterns: [
//       // English
//       /humidity/i,
//       /what's the humidity/i,
//       /whats the humidity/i,
//       /current humidity/i,
//       /humidity level/i,
//       /humidity reading/i,
//       /how humid/i,
//       /how humid is it/i,
//       /how moist/i,
//       /moisture level/i,
//       /moisture/i,
//       /humidity status/i,
//       /check humidity/i,
//       /tell me humidity/i,
//       /give me humidity/i,
//       /is it humid/i,
//       /is it moist/i,
//       /humidity please/i,

//       // Hinglish
//       /nami kya hai/i,
//       /aardrata batao/i,

//       // Hindi
//       /नमी क्या है/i,
//       /आर्द्रता क्या है/i,
//       /वातावरण में नमी कितनी है/i,
//     ],
//     action: () => {
//       speakResponse(`Humidity level is ${humidity} percent`);
//     },
//   },

//   // ================ SECURITY/MOTION QUERIES ================
//   {
//     patterns: [
//       // English
//       /motion/i,
//       /any motion/i,
//       /motion detected/i,
//       /movement/i,
//       /any movement/i,
//       /movement detected/i,
//       /security/i,
//       /security status/i,
//       /security check/i,
//       /any alerts/i,
//       /alerts/i,
//       /any security alerts/i,
//       /is everything safe/i,
//       /all clear/i,
//       /everything okay/i,
//       /any activity/i,
//       /any intrusion/i,
//       /check security/i,
//       /security report/i,
//       /what's happening/i,
//       /whats happening/i,
//       /anything going on/i,

//       // Hinglish
//       /koi halchal hai/i,
//       /suraksha check karo/i,
//       /ghar safe hai kya/i,

//       // Hindi
//       /कोई हलचल है/i,
//       /सुरक्षा की स्थिति बताओ/i,
//       /घर सुरक्षित है क्या/i,
//       /सब सुरक्षित है/i,
//     ],
//     action: () => {
//       const motionStatus = motionDetected
//         ? `Motion detected. ${motionAlerts.length} alerts total`
//         : "No motion detected. All clear";
//       speakResponse(motionStatus);
//     },
//   },

//   // ================ SMART SCENE COMMANDS ================
//   {
//     patterns: [
//       // English
//       /goodnight/i,
//       /good night/i,
//       /going to sleep/i,
//       /time for bed/i,
//       /bedtime/i,
//       /sleep time/i,
//       /night mode/i,
//       /sleep mode/i,
//       /good night bruno/i,
//       /goodnight bruno/i,
//       /see you tomorrow/i,
//       /turning in/i,
//       /going to bed/i,
//       /time to sleep/i,

//       // Hinglish
//       /shubh ratri/i,
//       /so jao mode/i,

//       // Hindi
//       /शुभ रात्रि/i,
//       /सोने का समय/i,
//       /स्लीप मोड/i,
//     ],
//     action: () => {
//       dispatch(toggleAllLights());
//       socket.emit("toggleAllLights", { allLightsState: false });
//       speakResponse("Good night! Turning off all devices");
//     },
//   },
//   {
//     patterns: [
//       // English
//       /i'm home/i,
//       /im home/i,
//       /i am home/i,
//       /hello bruno/i,
//       /hi bruno/i,
//       /hey bruno/i,
//       /i'm back/i,
//       /im back/i,
//       /i am back/i,
//       /home sweet home/i,
//       /arrived/i,
//       /just got home/i,
//       /welcome me/i,
//       /welcome home/i,
//       /home mode/i,
//       /arrival mode/i,
//       /entry mode/i,

//       // Hinglish
//       /main ghar aaya/i,
//       /ghar pahunch gaya/i,

//       // Hindi
//       /मैं घर आया हूँ/i,
//       /घर पहुंच गया/i,
//       /स्वागत करो/i,
//     ],
//     action: () => {
//       dispatch(toggleYellowLed());
//       socket.emit("toggleYellowLed", { yellowLedState: true });
//       speakResponse("Welcome home! Turning on entry light");
//     },
//   },

//   // ================ GENERAL ASSISTANT COMMANDS ================
//   {
//     patterns: [
//       // English
//       /status/i,
//       /system status/i,
//       /how are you/i,
//       /how are you doing/i,
//       /are you working/i,
//       /are you okay/i,
//       /help/i,
//       /what can you do/i,
//       /commands/i,
//       /list commands/i,
//       /available commands/i,
//       /test/i,
//       /hello/i,
//       /hi there/i,
//       /are you there/i,
//       /can you hear me/i,

//       // Hinglish
//       /tum kaise ho/i,
//       /madad karo/i,
//       /commands batao/i,

//       // Hindi
//       /तुम कैसे हो/i,
//       /मदद करो/i,
//       /आदेश सूची/i,
//       /आप ठीक हो/i,
//     ],
//     action: () => {
//       speakResponse(
//         "मैं ठीक हूँ! मैं आपके लाइट्स, पंखा, तापमान, आर्द्रता और सुरक्षा की जानकारी नियंत्रित कर सकता हूँ। बस पूछिए!"
//       );
//     },
//   },
// ];

import { Dispatch } from "@reduxjs/toolkit";
import {
  toggleRedLed,
  toggleGreenLed,
  toggleYellowLed,
  toggleAllLights,
} from "@/redux/lightSyncSlice";

// Define types
export interface CommandPattern {
  patterns: RegExp[];
  action: (matchedText: string) => void;
}

interface VoiceCommandParams {
  dispatch: Dispatch;
  socket: any;
  temperature: number;
  humidity: number;
  motionDetected: boolean;
  motionAlerts: any[];
  speakResponse: (text: string, language?: string) => void; // language optional param
}

// ✅ English + Hinglish + Pure Hindi with language-aware responses
export const createVoiceCommands = ({
  dispatch,
  socket,
  temperature,
  humidity,
  motionDetected,
  motionAlerts,
  speakResponse,
}: VoiceCommandParams): CommandPattern[] => [
  // ================ LAMP 1 / RED LED COMMANDS ================
  {
    patterns: [
      // English
      /turn on lamp 1/i,
      /switch on lamp 1/i,
      /lamp 1 on/i,
      /enable lamp 1/i,
      /activate lamp 1/i,
      /turn on the lamp 1/i,
      /turn on the lamp one/i,
      /turn on lamp one/i,
      /switch on lamp one/i,
      /lamp one on/i,
      /enable lamp one/i,
      /activate lamp one/i,
      /turn the first lamp on/i,
      /switch the first lamp on/i,
      /first lamp on/i,
      /red lamp on/i,
      /red light on/i,
      /turn on red lamp/i,
      /switch on red light/i,
      /light up lamp 1/i,
      /light up lamp one/i,
      /start lamp 1/i,
      /start lamp one/i,

      // Hinglish
      /lamp ek chalu karo/i,
      /pehli batti jalao/i,
      /lal batti chalu karo/i,

      // Hindi
      /लैम्प 1 चालू करो/i,
      /लैम्प एक चालू करो/i,
      /पहली बत्ती जलाओ/i,
      /लाल बत्ती चालू करो/i,
      /लाल लाइट ऑन करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleRedLed());
      socket.emit("toggleRedLed", { redLedState: true });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi ? "लैम्प 1 चालू हो गया" : "Lamp 1 turned on";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },
  {
    patterns: [
      // English
      /turn off lamp 1/i,
      /switch off lamp 1/i,
      /lamp 1 off/i,
      /disable lamp 1/i,
      /deactivate lamp 1/i,
      /turn off the lamp 1/i,
      /turn off lamp one/i,
      /switch off lamp one/i,
      /lamp one off/i,
      /disable lamp one/i,
      /deactivate lamp one/i,
      /turn off the lamp one/i,
      /turn the first lamp off/i,
      /switch the first lamp off/i,
      /first lamp off/i,
      /red lamp off/i,
      /red light off/i,
      /turn off red lamp/i,
      /switch off red light/i,
      /shut off lamp 1/i,
      /shut off lamp one/i,
      /stop lamp 1/i,
      /stop lamp one/i,

      // Hinglish
      /lamp ek band karo/i,
      /pehli batti bujha do/i,
      /lal batti band karo/i,

      // Hindi
      /लैम्प 1 बंद करो/i,
      /लैम्प एक बंद करो/i,
      /पहली बत्ती बुझा दो/i,
      /लाल बत्ती बंद करो/i,
      /लाल लाइट ऑफ करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleRedLed());
      socket.emit("toggleRedLed", { redLedState: false });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi ? "लैम्प 1 बंद हो गया" : "Lamp 1 turned off";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },

  // ================ LAMP 2 / YELLOW LED COMMANDS ================
  {
    patterns: [
      // English
      /turn on lamp 2/i,
      /switch on lamp 2/i,
      /lamp 2 on/i,
      /enable lamp 2/i,
      /activate lamp 2/i,
      /turn on the lamp 2/i,
      /turn on lamp two/i,
      /switch on lamp two/i,
      /lamp two on/i,
      /enable lamp two/i,
      /activate lamp two/i,
      /turn on the lamp two/i,
      /turn the second lamp on/i,
      /switch the second lamp on/i,
      /second lamp on/i,
      /yellow lamp on/i,
      /yellow light on/i,
      /turn on yellow lamp/i,
      /switch on yellow light/i,
      /light up lamp 2/i,
      /light up lamp two/i,
      /start lamp 2/i,
      /start lamp two/i,

      // Hinglish
      /lamp do chalu karo/i,
      /dusri batti jalao/i,
      /peeli batti chalu karo/i,

      // Hindi
      /लैम्प 2 चालू करो/i,
      /लैम्प दो चालू करो/i,
      /दूसरी बत्ती जलाओ/i,
      /पीली बत्ती चालू करो/i,
      /पीली लाइट ऑन करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleYellowLed());
      socket.emit("toggleYellowLed", { yellowLedState: true });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi ? "लैम्प 2 चालू हो गया" : "Lamp 2 turned on";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },
  {
    patterns: [
      // English
      /turn off lamp 2/i,
      /turn off the lamp 2/i,
      /switch off lamp 2/i,
      /lamp 2 off/i,
      /disable lamp 2/i,
      /deactivate lamp 2/i,
      /turn off lamp two/i,
      /switch off lamp two/i,
      /lamp two off/i,
      /disable lamp two/i,
      /deactivate lamp two/i,
      /turn off the lamp two/i,
      /turn the second lamp off/i,
      /switch the second lamp off/i,
      /second lamp off/i,
      /yellow lamp off/i,
      /yellow light off/i,
      /turn off yellow lamp/i,
      /switch off yellow light/i,
      /shut off lamp 2/i,
      /shut off lamp two/i,
      /stop lamp 2/i,
      /stop lamp two/i,

      // Hinglish
      /lamp do band karo/i,
      /dusri batti bujha do/i,
      /peeli batti band karo/i,

      // Hindi
      /लैम्प 2 बंद करो/i,
      /लैम्प दो बंद करो/i,
      /दूसरी बत्ती बुझा दो/i,
      /पीली बत्ती बंद करो/i,
      /पीली लाइट ऑफ करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleYellowLed());
      socket.emit("toggleYellowLed", { yellowLedState: false });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi ? "लैम्प 2 बंद हो गया" : "Lamp 2 turned off";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },

  // ================ FAN / GREEN LED COMMANDS ================
  {
    patterns: [
      // English
      /turn on fan/i,
      /switch on fan/i,
      /turn on the fan/i,
      /fan on/i,
      /start fan/i,
      /start the fan/i,
      /activate fan/i,
      /enable fan/i,
      /turn the fan on/i,
      /switch the fan on/i,
      /power on fan/i,
      /power up fan/i,
      /green light on/i,
      /green lamp on/i,
      /turn on green light/i,
      /get the fan going/i,
      /fire up the fan/i,
      /spin the fan/i,
      /turn on air/i,
      /start air circulation/i,

      // Hinglish
      /pankha chalu karo/i,
      /hawa chalu karo/i,
      /green light on karo/i,

      // Hindi
      /पंखा चालू करो/i,
      /हवा चालू करो/i,
      /हरी बत्ती चालू करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleGreenLed());
      socket.emit("toggleGreenLed", { greenLedState: true });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi ? "पंखा चालू हो गया" : "Fan turned on";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },
  {
    patterns: [
      // English
      /turn off fan/i,
      /switch off fan/i,
      /turn off the fan/i,
      /fan off/i,
      /stop fan/i,
      /stop the fan/i,
      /deactivate fan/i,
      /disable fan/i,
      /turn the fan off/i,
      /switch the fan off/i,
      /power off fan/i,
      /power down fan/i,
      /green light off/i,
      /green lamp off/i,
      /turn off green light/i,
      /shut off fan/i,
      /shut down fan/i,
      /kill the fan/i,
      /turn off air/i,
      /stop air circulation/i,

      // Hinglish
      /pankha band karo/i,
      /hawa band karo/i,
      /green light off karo/i,

      // Hindi
      /पंखा बंद करो/i,
      /हवा बंद करो/i,
      /हरी बत्ती बंद करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleGreenLed());
      socket.emit("toggleGreenLed", { greenLedState: false });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi ? "पंखा बंद हो गया" : "Fan turned off";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },

  // ================ ALL DEVICES COMMANDS ================
  {
    patterns: [
      // English
      /turn on everything/i,
      /switch on everything/i,
      /everything on/i,
      /turn on all devices/i,
      /turn all device on/i,
      /all on/i,
      /all devices on/i,
      /turn on all/i,
      /switch on all/i,
      /all lights on/i,
      /turn on all lights/i,
      /switch on all lights/i,
      /all lamps on/i,
      /turn on all lamps/i,
      /lights on/i,
      /lamps on/i,
      /power on everything/i,
      /power up everything/i,
      /activate all/i,
      /enable all/i,
      /start everything/i,
      /light up the house/i,
      /light up everything/i,
      /turn it all on/i,
      /full power/i,

      // Hinglish
      /sab kuch chalu karo/i,
      /sab lights on karo/i,
      /ghar ki sari roshni jalao/i,

      // Hindi
      /सब कुछ चालू करो/i,
      /सभी बत्तियां चालू करो/i,
      /घर की सारी रोशनी जलाओ/i,
      /सभी उपकरण चालू करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleAllLights());
      socket.emit("toggleAllLights", { allLightsState: true });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi
        ? "सभी उपकरण चालू हो गए"
        : "All devices turned on";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },
  {
    patterns: [
      // English
      /turn off everything/i,
      /switch off everything/i,
      /turn off all devices/i,
      /turn all devices off/i,
      /everything off/i,
      /all off/i,
      /all devices off/i,
      /turn off all/i,
      /switch off all/i,
      /all lights off/i,
      /turn off all lights/i,
      /switch off all lights/i,
      /all lamps off/i,
      /turn off all lamps/i,
      /lights off/i,
      /lamps off/i,
      /power off everything/i,
      /power down everything/i,
      /deactivate all/i,
      /disable all/i,
      /stop everything/i,
      /shut everything off/i,
      /shut it all off/i,
      /kill all lights/i,
      /darkness/i,

      // Hinglish
      /sab kuch band karo/i,
      /sab lights off karo/i,
      /ghar andhera karo/i,

      // Hindi
      /सब कुछ बंद करो/i,
      /सभी बत्तियां बंद करो/i,
      /घर अंधेरा करो/i,
      /सभी उपकरण बंद करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleAllLights());
      socket.emit("toggleAllLights", { allLightsState: false });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi
        ? "सभी उपकरण बंद हो गए"
        : "All devices turned off";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },

  // ================ TEMPERATURE QUERIES ================
  {
    patterns: [
      // English
      /what.*temperature/i,
      /what's the temperature/i,
      /whats the temperature/i,
      /current temperature/i,
      /room temperature/i,
      /temp/i,
      /how hot/i,
      /how warm/i,
      /how hot is it/i,
      /how warm is it/i,
      /temperature status/i,
      /temperature reading/i,
      /check temperature/i,
      /tell me temperature/i,
      /give me temperature/i,
      /is it hot/i,
      /is it warm/i,
      /temperature please/i,

      // Hinglish
      /tapman kya hai/i,
      /room ka temperature batao/i,
      /kitni garmi hai/i,

      // Hindi
      /तापमान क्या है/i,
      /कमरे का तापमान बताओ/i,
      /कितनी गर्मी है/i,
      /कमरे का सामान्य तापमान/i,
    ],
    action: (matchedText: string) => {
      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi
        ? `वर्तमान तापमान ${temperature} डिग्री सेल्सियस है`
        : `Current temperature is ${temperature} degrees celsius`;
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },

  // ================ HUMIDITY QUERIES ================
  {
    patterns: [
      // English
      /humidity/i,
      /what's the humidity/i,
      /whats the humidity/i,
      /current humidity/i,
      /humidity level/i,
      /humidity reading/i,
      /how humid/i,
      /how humid is it/i,
      /how moist/i,
      /moisture level/i,
      /moisture/i,
      /humidity status/i,
      /check humidity/i,
      /tell me humidity/i,
      /give me humidity/i,
      /is it humid/i,
      /is it moist/i,
      /humidity please/i,

      // Hinglish
      /nami kya hai/i,
      /aardrata batao/i,

      // Hindi
      /नमी क्या है/i,
      /आर्द्रता क्या है/i,
      /वातावरण में नमी कितनी है/i,
    ],
    action: (matchedText: string) => {
      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi
        ? `आर्द्रता स्तर ${humidity} प्रतिशत है`
        : `Humidity level is ${humidity} percent`;
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },

  // ================ SECURITY/MOTION QUERIES ================
  {
    patterns: [
      // English
      /motion/i,
      /any motion/i,
      /motion detected/i,
      /movement/i,
      /any movement/i,
      /movement detected/i,
      /security/i,
      /security status/i,
      /security check/i,
      /any alerts/i,
      /alerts/i,
      /any security alerts/i,
      /is everything safe/i,
      /all clear/i,
      /everything okay/i,
      /any activity/i,
      /any intrusion/i,
      /check security/i,
      /security report/i,
      /what's happening/i,
      /whats happening/i,
      /anything going on/i,

      // Hinglish
      /koi halchal hai/i,
      /suraksha check karo/i,
      /ghar safe hai kya/i,

      // Hindi
      /कोई हलचल है/i,
      /सुरक्षा की स्थिति बताओ/i,
      /घर सुरक्षित है क्या/i,
      /सब सुरक्षित है/i,
    ],
    action: (matchedText: string) => {
      const motionStatus = motionDetected
        ? /[\u0900-\u097F]/.test(matchedText)
          ? `दरवाजे के पीछे हलचल मिली। कुल ${motionAlerts.length} सूचनाएं।`
          : `Motion detected. ${motionAlerts.length} alerts total.`
        : /[\u0900-\u097F]/.test(matchedText)
        ? "कोई हलचल नहीं मिली। सब कुछ ठीक है।"
        : "No motion detected. All clear.";
      speakResponse(
        motionStatus,
        /[\u0900-\u097F]/.test(matchedText) ? "hi-IN" : "en-US"
      );
    },
  },

  // ================ SMART SCENE COMMANDS ================
  {
    patterns: [
      // English
      /goodnight/i,
      /good night/i,
      /going to sleep/i,
      /time for bed/i,
      /bedtime/i,
      /sleep time/i,
      /night mode/i,
      /sleep mode/i,
      /good night bruno/i,
      /goodnight bruno/i,
      /see you tomorrow/i,
      /turning in/i,
      /going to bed/i,
      /time to sleep/i,

      // Hinglish
      /shubh ratri/i,
      /so jao mode/i,

      // Hindi
      /शुभ रात्रि/i,
      /सोने का समय/i,
      /स्लीप मोड/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleAllLights());
      socket.emit("toggleAllLights", { allLightsState: false });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi
        ? "शुभ रात्रि! सभी उपकरण बंद कर रहा हूँ।"
        : "Good night! Turning off all devices.";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },
  {
    patterns: [
      // English
      /i'm home/i,
      /im home/i,
      /i am home/i,
      /hello bruno/i,
      /hi bruno/i,
      /hey bruno/i,
      /i'm back/i,
      /im back/i,
      /i am back/i,
      /home sweet home/i,
      /arrived/i,
      /just got home/i,
      /welcome me/i,
      /welcome home/i,
      /home mode/i,
      /arrival mode/i,
      /entry mode/i,

      // Hinglish
      /main ghar aaya/i,
      /ghar pahunch gaya/i,

      // Hindi
      /मैं घर आया हूँ/i,
      /घर पहुंच गया/i,
      /स्वागत करो/i,
    ],
    action: (matchedText: string) => {
      dispatch(toggleYellowLed());
      socket.emit("toggleYellowLed", { yellowLedState: true });

      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi
        ? "स्वागत है! प्रवेश लाइट चालू कर रहा हूँ।"
        : "Welcome home! Turning on entry light.";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },

  // ================ GENERAL ASSISTANT COMMANDS ================
  {
    patterns: [
      // English
      /status/i,
      /system status/i,
      /how are you/i,
      /how are you doing/i,
      /are you working/i,
      /are you okay/i,
      /help/i,
      /what can you do/i,
      /commands/i,
      /list commands/i,
      /available commands/i,
      /test/i,
      /hello/i,
      /hi there/i,
      /are you there/i,
      /can you hear me/i,

      // Hinglish
      /tum kaise ho/i,
      /madad karo/i,
      /commands batao/i,

      // Hindi
      /तुम कैसे हो/i,
      /मदद करो/i,
      /आदेश सूची/i,
      /आप ठीक हो/i,
    ],
    action: (matchedText: string) => {
      const isHindi = /[\u0900-\u097F]/.test(matchedText);
      const responseText = isHindi
        ? "मैं ठीक हूँ! मैं आपके लाइट्स, पंखा, तापमान, आर्द्रता और सुरक्षा की जानकारी नियंत्रित कर सकता हूँ। बस पूछिए!"
        : "I'm working perfectly! I can control your lights, fan, check temperature, humidity, and security status. Just ask me!";
      speakResponse(responseText, isHindi ? "hi-IN" : "en-US");
    },
  },
];
