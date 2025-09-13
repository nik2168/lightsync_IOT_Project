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
  action: () => void;
}

interface VoiceCommandParams {
  dispatch: Dispatch;
  socket: any;
  temperature: number;
  humidity: number;
  motionDetected: boolean;
  motionAlerts: any[];
  speakResponse: (text: string) => void;
}

// ✅ Enhanced voice command patterns with comprehensive variations
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
      // Numbers as digits
      /turn on lamp 1/i,
      /switch on lamp 1/i,
      /lamp 1 on/i,
      /enable lamp 1/i,
      /activate lamp 1/i,
      // Numbers as words
      /turn on lamp one/i,
      /switch on lamp one/i,
      /lamp one on/i,
      /enable lamp one/i,
      /activate lamp one/i,
      // Alternative phrasings
      /turn the first lamp on/i,
      /switch the first lamp on/i,
      /first lamp on/i,
      /red lamp on/i,
      /red light on/i,
      /turn on red lamp/i,
      /switch on red light/i,
      // Casual commands
      /light up lamp 1/i,
      /light up lamp one/i,
      /start lamp 1/i,
      /start lamp one/i,
    ],
    action: () => {
      dispatch(toggleRedLed());
      socket.emit("toggleRedLed", { redLedState: true });
      speakResponse("Lamp 1 turned on");
    },
  },
  {
    patterns: [
      // Numbers as digits
      /turn off lamp 1/i,
      /switch off lamp 1/i,
      /lamp 1 off/i,
      /disable lamp 1/i,
      /deactivate lamp 1/i,
      // Numbers as words
      /turn off lamp one/i,
      /switch off lamp one/i,
      /lamp one off/i,
      /disable lamp one/i,
      /deactivate lamp one/i,
      // Alternative phrasings
      /turn the first lamp off/i,
      /switch the first lamp off/i,
      /first lamp off/i,
      /red lamp off/i,
      /red light off/i,
      /turn off red lamp/i,
      /switch off red light/i,
      // Casual commands
      /shut off lamp 1/i,
      /shut off lamp one/i,
      /stop lamp 1/i,
      /stop lamp one/i,
    ],
    action: () => {
      dispatch(toggleRedLed());
      socket.emit("toggleRedLed", { redLedState: false });
      speakResponse("Lamp 1 turned off");
    },
  },

  // ================ LAMP 2 / YELLOW LED COMMANDS ================
  {
    patterns: [
      // Numbers as digits
      /turn on lamp 2/i,
      /switch on lamp 2/i,
      /lamp 2 on/i,
      /enable lamp 2/i,
      /activate lamp 2/i,
      // Numbers as words
      /turn on lamp two/i,
      /switch on lamp two/i,
      /lamp two on/i,
      /enable lamp two/i,
      /activate lamp two/i,
      // Alternative phrasings
      /turn the second lamp on/i,
      /switch the second lamp on/i,
      /second lamp on/i,
      /yellow lamp on/i,
      /yellow light on/i,
      /turn on yellow lamp/i,
      /switch on yellow light/i,
      // Casual commands
      /light up lamp 2/i,
      /light up lamp two/i,
      /start lamp 2/i,
      /start lamp two/i,
    ],
    action: () => {
      dispatch(toggleYellowLed());
      socket.emit("toggleYellowLed", { yellowLedState: true });
      speakResponse("Lamp 2 turned on");
    },
  },
  {
    patterns: [
      // Numbers as digits
      /turn off lamp 2/i,
      /switch off lamp 2/i,
      /lamp 2 off/i,
      /disable lamp 2/i,
      /deactivate lamp 2/i,
      // Numbers as words
      /turn off lamp two/i,
      /switch off lamp two/i,
      /lamp two off/i,
      /disable lamp two/i,
      /deactivate lamp two/i,
      // Alternative phrasings
      /turn the second lamp off/i,
      /switch the second lamp off/i,
      /second lamp off/i,
      /yellow lamp off/i,
      /yellow light off/i,
      /turn off yellow lamp/i,
      /switch off yellow light/i,
      // Casual commands
      /shut off lamp 2/i,
      /shut off lamp two/i,
      /stop lamp 2/i,
      /stop lamp two/i,
    ],
    action: () => {
      dispatch(toggleYellowLed());
      socket.emit("toggleYellowLed", { yellowLedState: false });
      speakResponse("Lamp 2 turned off");
    },
  },

  // ================ FAN / GREEN LED COMMANDS ================
  {
    patterns: [
      // Basic fan commands
      /turn on fan/i,
      /switch on fan/i,
      /fan on/i,
      /start fan/i,
      /start the fan/i,
      /activate fan/i,
      /enable fan/i,
      // Alternative phrasings
      /turn the fan on/i,
      /switch the fan on/i,
      /power on fan/i,
      /power up fan/i,
      /green light on/i,
      /green lamp on/i,
      /turn on green light/i,
      // Casual commands
      /get the fan going/i,
      /fire up the fan/i,
      /spin the fan/i,
      /turn on air/i,
      /start air circulation/i,
    ],
    action: () => {
      dispatch(toggleGreenLed());
      socket.emit("toggleGreenLed", { greenLedState: true });
      speakResponse("Fan turned on");
    },
  },
  {
    patterns: [
      // Basic fan commands
      /turn off fan/i,
      /switch off fan/i,
      /fan off/i,
      /stop fan/i,
      /stop the fan/i,
      /deactivate fan/i,
      /disable fan/i,
      // Alternative phrasings
      /turn the fan off/i,
      /switch the fan off/i,
      /power off fan/i,
      /power down fan/i,
      /green light off/i,
      /green lamp off/i,
      /turn off green light/i,
      // Casual commands
      /shut off fan/i,
      /shut down fan/i,
      /kill the fan/i,
      /turn off air/i,
      /stop air circulation/i,
    ],
    action: () => {
      dispatch(toggleGreenLed());
      socket.emit("toggleGreenLed", { greenLedState: false });
      speakResponse("Fan turned off");
    },
  },

  // ================ ALL DEVICES COMMANDS ================
  {
    patterns: [
      // Everything on
      /turn on everything/i,
      /switch on everything/i,
      /everything on/i,
      /all on/i,
      /all devices on/i,
      /turn on all/i,
      /switch on all/i,
      // Lights specific
      /all lights on/i,
      /turn on all lights/i,
      /switch on all lights/i,
      /all lamps on/i,
      /turn on all lamps/i,
      /lights on/i,
      /lamps on/i,
      // Power commands
      /power on everything/i,
      /power up everything/i,
      /activate all/i,
      /enable all/i,
      /start everything/i,
      // Casual commands
      /light up the house/i,
      /light up everything/i,
      /turn it all on/i,
      /full power/i,
    ],
    action: () => {
      dispatch(toggleAllLights());
      socket.emit("toggleAllLights", { allLightsState: true });
      speakResponse("All devices turned on");
    },
  },
  {
    patterns: [
      // Everything off
      /turn off everything/i,
      /switch off everything/i,
      /everything off/i,
      /all off/i,
      /all devices off/i,
      /turn off all/i,
      /switch off all/i,
      // Lights specific
      /all lights off/i,
      /turn off all lights/i,
      /switch off all lights/i,
      /all lamps off/i,
      /turn off all lamps/i,
      /lights off/i,
      /lamps off/i,
      // Power commands
      /power off everything/i,
      /power down everything/i,
      /deactivate all/i,
      /disable all/i,
      /stop everything/i,
      // Casual commands
      /shut everything off/i,
      /shut it all off/i,
      /kill all lights/i,
      /darkness/i,
    ],
    action: () => {
      dispatch(toggleAllLights());
      socket.emit("toggleAllLights", { allLightsState: false });
      speakResponse("All devices turned off");
    },
  },

  // ================ TEMPERATURE QUERIES ================
  {
    patterns: [
      // Direct temperature questions
      /what.*temperature/i,
      /what's the temperature/i,
      /whats the temperature/i,
      /current temperature/i,
      /room temperature/i,
      /temp/i,
      // How hot questions
      /how hot/i,
      /how warm/i,
      /how hot is it/i,
      /how warm is it/i,
      // Temperature status
      /temperature status/i,
      /temperature reading/i,
      /check temperature/i,
      /tell me temperature/i,
      /give me temperature/i,
      // Casual questions
      /is it hot/i,
      /is it warm/i,
      /temperature please/i,
    ],
    action: () => {
      speakResponse(`Current temperature is ${temperature} degrees celsius`);
    },
  },

  // ================ HUMIDITY QUERIES ================
  {
    patterns: [
      // Direct humidity questions
      /humidity/i,
      /what's the humidity/i,
      /whats the humidity/i,
      /current humidity/i,
      /humidity level/i,
      /humidity reading/i,
      // How humid questions
      /how humid/i,
      /how humid is it/i,
      /how moist/i,
      /moisture level/i,
      /moisture/i,
      // Status questions
      /humidity status/i,
      /check humidity/i,
      /tell me humidity/i,
      /give me humidity/i,
      // Casual questions
      /is it humid/i,
      /is it moist/i,
      /humidity please/i,
    ],
    action: () => {
      speakResponse(`Humidity level is ${humidity} percent`);
    },
  },

  // ================ SECURITY/MOTION QUERIES ================
  {
    patterns: [
      // Motion detection
      /motion/i,
      /any motion/i,
      /motion detected/i,
      /movement/i,
      /any movement/i,
      /movement detected/i,
      // Security queries
      /security/i,
      /security status/i,
      /security check/i,
      /any alerts/i,
      /alerts/i,
      /any security alerts/i,
      // Safety questions
      /is everything safe/i,
      /all clear/i,
      /everything okay/i,
      /any activity/i,
      /any intrusion/i,
      // Casual security
      /check security/i,
      /security report/i,
      /what's happening/i,
      /whats happening/i,
      /anything going on/i,
    ],
    action: () => {
      const motionStatus = motionDetected
        ? `Motion detected at back door. ${motionAlerts.length} alerts total`
        : "No motion detected. All clear";
      speakResponse(motionStatus);
    },
  },

  // ================ SMART SCENE COMMANDS ================
  {
    patterns: [
      // Goodnight scenes
      /goodnight/i,
      /good night/i,
      /going to sleep/i,
      /time for bed/i,
      /bedtime/i,
      /sleep time/i,
      /night mode/i,
      /sleep mode/i,
      // Casual goodnight
      /good night bruno/i,
      /goodnight bruno/i,
      /see you tomorrow/i,
      /turning in/i,
      /going to bed/i,
      /time to sleep/i,
    ],
    action: () => {
      dispatch(toggleAllLights());
      socket.emit("toggleAllLights", { allLightsState: false });
      speakResponse("Good night! Turning off all devices");
    },
  },
  {
    patterns: [
      // Home arrival
      /i'm home/i,
      /im home/i,
      /i am home/i,
      /hello bruno/i,
      /hi bruno/i,
      /hey bruno/i,
      // Arrival greetings
      /i'm back/i,
      /im back/i,
      /i am back/i,
      /home sweet home/i,
      /arrived/i,
      /just got home/i,
      // Welcome commands
      /welcome me/i,
      /welcome home/i,
      /home mode/i,
      /arrival mode/i,
      /entry mode/i,
    ],
    action: () => {
      dispatch(toggleYellowLed());
      socket.emit("toggleYellowLed", { yellowLedState: true });
      speakResponse("Welcome home! Turning on entry light");
    },
  },

  // ================ GENERAL ASSISTANT COMMANDS ================
  {
    patterns: [
      // Status check
      /status/i,
      /system status/i,
      /how are you/i,
      /how are you doing/i,
      /are you working/i,
      /are you okay/i,
      // Help commands
      /help/i,
      /what can you do/i,
      /commands/i,
      /list commands/i,
      /available commands/i,
      // Test commands
      /test/i,
      /hello/i,
      /hi there/i,
      /are you there/i,
      /can you hear me/i,
    ],
    action: () => {
      speakResponse(
        "I'm working perfectly! I can control your lights, fan, check temperature, humidity, and security status. Just ask me!"
      );
    },
  },
];
