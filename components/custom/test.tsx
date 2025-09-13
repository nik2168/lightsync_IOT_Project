// import { Image } from "expo-image";
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Text, TouchableOpacity, View, Alert } from "react-native";
// import * as Speech from "expo-speech";
// import { Audio } from "expo-av";
// import * as FileSystem from "expo-file-system";
// import Constants from "expo-constants";
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withRepeat,
//   withSequence,
//   withTiming,
//   interpolate,
//   cancelAnimation,
//   withSpring,
// } from "react-native-reanimated";

// // Import your Redux hooks and socket
// import { useAppDispatch, useAppSelector } from "@/redux/hook";
// import { getSocket } from "@/redux/socket";
// import {
//   toggleRedLed,
//   toggleGreenLed,
//   toggleYellowLed,
//   toggleAllLights,
// } from "@/redux/lightSyncSlice";

// // Define types for the component
// interface CommandPattern {
//   patterns: RegExp[];
//   action: () => void;
// }

// const Bruno = () => {
//   const dispatch = useAppDispatch();
//   const socket = getSocket();

//   // Get Google Speech API key from Expo Constants
//   const GOOGLE_SPEECH_API_KEY = Constants.expoConfig?.extra?.googleSpeechKey;

//   // Redux state
//   const {
//     temperature,
//     humidity,
//     redLedState,
//     greenLedState,
//     yellowLedState,
//     allLightsState,
//     motionDetected,
//     motionAlerts,
//   } = useAppSelector((state) => state.lightSyncState);

//   console.log(
//     "Google Speech API Key:",
//     GOOGLE_SPEECH_API_KEY ? "✅ Loaded" : "❌ Missing"
//   );

//   // Component states
//   const [isListening, setIsListening] = useState(false);
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [userText, setUserText] = useState("");
//   const [aiResponse, setAiResponse] = useState(
//     "Hi! I'm Bruno, your smart home assistant. Tap me to give voice commands!"
//   );
//   const [isAISpeaking, setIsAISpeaking] = useState(false);
//   const [hasPermission, setHasPermission] = useState(false);
//   const [recording, setRecording] = useState<Audio.Recording | null>(null);

//   // Simple silence-based auto-stop
//   const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
//   const [maxRecordingTimer, setMaxRecordingTimer] =
//     useState<NodeJS.Timeout | null>(null);

//   // Animation values
//   const scale = useSharedValue(1);
//   const pulseValue = useSharedValue(1);
//   const glowOpacity = useSharedValue(0);

//   // Initialize audio permissions
//   useEffect(() => {
//     const initializeAudio = async () => {
//       try {
//         const { status } = await Audio.requestPermissionsAsync();
//         setHasPermission(status === "granted");

//         if (status !== "granted") {
//           Alert.alert(
//             "Voice Commands Unavailable",
//             "Bruno's voice features need microphone permissions. You can still use the app without voice commands.",
//             [{ text: "OK" }]
//           );
//         }

//         // Configure audio mode for recording
//         await Audio.setAudioModeAsync({
//           allowsRecordingIOS: true,
//           playsInSilentModeIOS: true,
//         });
//       } catch (error) {
//         console.error("Error initializing audio:", error);
//         setHasPermission(false);
//       }
//     };

//     initializeAudio();
//   }, []);

//   // Cleanup timers
//   useEffect(() => {
//     return () => {
//       if (silenceTimer) clearTimeout(silenceTimer);
//       if (maxRecordingTimer) clearTimeout(maxRecordingTimer);
//     };
//   }, [silenceTimer, maxRecordingTimer]);

//   // ✅ Process voice command using Google Speech-to-Text API (Fixed for empty results)
//   const transcribeWithGoogle = async (audioUri: string): Promise<string> => {
//     if (!GOOGLE_SPEECH_API_KEY) {
//       throw new Error("Google Speech API key not found");
//     }

//     try {
//       setIsTranscribing(true);
//       setUserText("Converting audio...");

//       console.log("🎙️ Processing audio with Google Speech API");

//       // Convert audio to base64
//       const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // ✅ Debug: Log the first few characters of base64 to verify audio data
//       console.log("📊 Base64 audio length:", base64Audio.length);
//       console.log("📊 Base64 preview:", base64Audio.substring(0, 50));

//       const requestBody = {
//         config: {
//           encoding: "WEBM_OPUS", // ✅ Try WEBM_OPUS first (often works better with mobile recordings)
//           sampleRateHertz: 48000, // ✅ Higher sample rate for WEBM_OPUS
//           languageCode: "en-US",
//           enableAutomaticPunctuation: true,
//           model: "latest_short",
//           audioChannelCount: 1, // ✅ Ensure mono audio
//         },
//         audio: {
//           content: base64Audio,
//         },
//       };

//       console.log("📤 Sending request with WEBM_OPUS encoding...");
//       console.log("🔧 Config:", {
//         encoding: requestBody.config.encoding,
//         sampleRate: requestBody.config.sampleRateHertz,
//         channels: requestBody.config.audioChannelCount,
//       });

//       const response = await fetch(
//         `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_SPEECH_API_KEY}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(requestBody),
//         }
//       );

//       console.log("📥 Response status:", response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("❌ Google Speech API error:", errorText);
//         throw new Error(`Google Speech API error: ${response.status}`);
//       }

//       const data = await response.json();

//       // ✅ Debug: Log the full response to see what we're getting
//       console.log("📄 Full API Response:", JSON.stringify(data, null, 2));

//       const transcriptionResult =
//         data.results?.[0]?.alternatives?.[0]?.transcript || "";

//       console.log("📝 Transcription Result:", transcriptionResult);

//       // ✅ If empty, try to understand why
//       if (!transcriptionResult) {
//         console.log("❌ Empty transcription. Response analysis:");
//         console.log("- Results array:", data.results?.length || 0, "items");
//         console.log(
//           "- First result:",
//           data.results?.[0] ? "exists" : "missing"
//         );
//         console.log(
//           "- Alternatives:",
//           data.results?.[0]?.alternatives?.length || 0,
//           "items"
//         );
//       }

//       return transcriptionResult.trim();
//     } catch (error) {
//       console.error("Google Speech transcription error:", error);
//       throw error;
//     } finally {
//       setIsTranscribing(false);
//     }
//   };

//   // Process voice command with current state values
//   const processVoiceCommand = useCallback(
//     (transcript: string) => {
//       console.log("🎙️ Processing command:", transcript);

//       if (!transcript || typeof transcript !== "string") {
//         console.log("❌ Invalid transcript:", transcript);
//         speakResponse("I didn't catch that. Please try again.");
//         return;
//       }

//       const lowerTranscript = transcript.toLowerCase();
//       let commandFound = false;

//       // Create command patterns with current state values
//       const commandPatterns: CommandPattern[] = [
//         // Lamp 1 commands
//         {
//           patterns: [/turn on lamp 1/i, /switch on lamp 1/i, /lamp 1 on/i],
//           action: () => {
//             dispatch(toggleRedLed());
//             socket.emit("toggleRedLed", { redLedState: true });
//             speakResponse("Lamp 1 turned on");
//           },
//         },
//         {
//           patterns: [/turn off lamp 1/i, /switch off lamp 1/i, /lamp 1 off/i],
//           action: () => {
//             dispatch(toggleRedLed());
//             socket.emit("toggleRedLed", { redLedState: false });
//             speakResponse("Lamp 1 turned off");
//           },
//         },
//         // Lamp 2 commands
//         {
//           patterns: [/turn on lamp 2/i, /switch on lamp 2/i, /lamp 2 on/i],
//           action: () => {
//             dispatch(toggleYellowLed());
//             socket.emit("toggleYellowLed", { yellowLedState: true });
//             speakResponse("Lamp 2 turned on");
//           },
//         },
//         {
//           patterns: [/turn off lamp 2/i, /switch off lamp 2/i, /lamp 2 off/i],
//           action: () => {
//             dispatch(toggleYellowLed());
//             socket.emit("toggleYellowLed", { yellowLedState: false });
//             speakResponse("Lamp 2 turned off");
//           },
//         },
//         // Fan commands
//         {
//           patterns: [/turn on fan/i, /start fan/i, /fan on/i, /start the fan/i],
//           action: () => {
//             dispatch(toggleGreenLed());
//             socket.emit("toggleGreenLed", { greenLedState: true });
//             speakResponse("Fan turned on");
//           },
//         },
//         {
//           patterns: [/turn off fan/i, /stop fan/i, /fan off/i, /stop the fan/i],
//           action: () => {
//             dispatch(toggleGreenLed());
//             socket.emit("toggleGreenLed", { greenLedState: false });
//             speakResponse("Fan turned off");
//           },
//         },
//         // All lights commands
//         {
//           patterns: [
//             /turn on everything/i,
//             /all lights on/i,
//             /turn on all lights/i,
//             /everything on/i,
//           ],
//           action: () => {
//             dispatch(toggleAllLights());
//             socket.emit("toggleAllLights", { allLightsState: true });
//             speakResponse("All devices turned on");
//           },
//         },
//         {
//           patterns: [
//             /turn off everything/i,
//             /all lights off/i,
//             /turn off all lights/i,
//             /everything off/i,
//           ],
//           action: () => {
//             dispatch(toggleAllLights());
//             socket.emit("toggleAllLights", { allLightsState: false });
//             speakResponse("All devices turned off");
//           },
//         },
//         // Information queries
//         {
//           patterns: [/what.*temperature/i, /how hot/i, /temperature/i],
//           action: () => {
//             speakResponse(
//               `Current temperature is ${temperature} degrees celsius`
//             );
//           },
//         },
//         {
//           patterns: [/humidity/i, /how humid/i, /moisture/i],
//           action: () => {
//             speakResponse(`Humidity level is ${humidity} percent`);
//           },
//         },
//         {
//           patterns: [/motion/i, /movement/i, /security/i, /any alerts/i],
//           action: () => {
//             const motionStatus = motionDetected
//               ? `Motion detected at back door. ${motionAlerts.length} alerts total`
//               : "No motion detected. All clear";
//             speakResponse(motionStatus);
//           },
//         },
//         // Smart commands
//         {
//           patterns: [/goodnight/i, /good night/i, /going to sleep/i],
//           action: () => {
//             dispatch(toggleAllLights());
//             socket.emit("toggleAllLights", { allLightsState: false });
//             speakResponse("Good night! Turning off all devices");
//           },
//         },
//         {
//           patterns: [/i'm home/i, /im home/i, /hello bruno/i],
//           action: () => {
//             dispatch(toggleYellowLed());
//             socket.emit("toggleYellowLed", { yellowLedState: true });
//             speakResponse("Welcome home! Turning on entry light");
//           },
//         },
//       ];

//       // Check each command pattern
//       for (const command of commandPatterns) {
//         for (const pattern of command.patterns) {
//           if (pattern.test(lowerTranscript)) {
//             console.log("✅ Command matched:", pattern);
//             command.action();
//             commandFound = true;
//             break;
//           }
//         }
//         if (commandFound) break;
//       }

//       // If no command matched
//       if (!commandFound) {
//         speakResponse("I didn't understand that command");
//       }
//     },
//     [
//       temperature,
//       humidity,
//       redLedState,
//       greenLedState,
//       yellowLedState,
//       allLightsState,
//       motionDetected,
//       motionAlerts,
//       dispatch,
//       socket,
//     ]
//   );

//   // Animation functions
//   const startPulseAnimation = () => {
//     pulseValue.value = withRepeat(
//       withSequence(
//         withTiming(1.2, { duration: 600 }),
//         withTiming(0.9, { duration: 600 }),
//         withTiming(1.1, { duration: 400 }),
//         withTiming(1, { duration: 400 })
//       ),
//       -1,
//       false
//     );
//     glowOpacity.value = withRepeat(
//       withSequence(
//         withTiming(0.8, { duration: 800 }),
//         withTiming(0.3, { duration: 800 })
//       ),
//       -1,
//       true
//     );
//   };

//   const stopPulseAnimation = () => {
//     cancelAnimation(pulseValue);
//     cancelAnimation(glowOpacity);
//     pulseValue.value = withSpring(1, { damping: 15, stiffness: 200 });
//     glowOpacity.value = withTiming(0, { duration: 300 });
//   };

//   // Voice interaction handlers
//   const handleVoiceInteraction = () => {
//     if (!hasPermission) {
//       Alert.alert(
//         "Permissions Required",
//         "Please enable microphone permissions in your device settings.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     if (!GOOGLE_SPEECH_API_KEY) {
//       Alert.alert(
//         "Configuration Error",
//         "Google Speech API key not found. Please check your app configuration.",
//         [{ text: "OK" }]
//       );
//       return;
//     }

//     if (isListening) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   const startListening = async () => {
//     try {
//       setUserText("Listening...");
//       setIsListening(true);
//       startPulseAnimation();

//       // ✅ Use LOW_QUALITY preset for LINEAR16 compatibility (creates WAV files)
//       const recordingOptions = Audio.RecordingOptionsPresets.LOW_QUALITY;

//       const { recording: newRecording } = await Audio.Recording.createAsync(
//         recordingOptions
//       );
//       setRecording(newRecording);

//       // ✅ Smart auto-stop: 3 seconds of silence OR 8 seconds max
//       const silenceTimeout = setTimeout(() => {
//         console.log("🔇 Silence detected - auto stopping...");
//         setUserText("Auto-stopping...");
//         stopListening();
//       }, 3000); // Stop after 3 seconds of assumed silence

//       const maxTimeout = setTimeout(() => {
//         console.log("⏱️ Max recording time reached - stopping...");
//         setUserText("Max time reached...");
//         stopListening();
//       }, 8000); // Maximum 8 seconds

//       setSilenceTimer(silenceTimeout);
//       setMaxRecordingTimer(maxTimeout);

//       console.log("🎙️ Recording started (LINEAR16, auto-stop enabled)");
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       setIsListening(false);
//       stopPulseAnimation();
//       speakResponse(
//         "Sorry, I couldn't start listening. Please check your microphone permissions."
//       );
//     }
//   };

//   const stopListening = async () => {
//     try {
//       if (!recording) return;

//       console.log("🛑 Stopping recording");
//       setIsListening(false);
//       stopPulseAnimation();

//       // Clear timers
//       if (silenceTimer) {
//         clearTimeout(silenceTimer);
//         setSilenceTimer(null);
//       }
//       if (maxRecordingTimer) {
//         clearTimeout(maxRecordingTimer);
//         setMaxRecordingTimer(null);
//       }

//       setUserText("Processing...");

//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setRecording(null);

//       if (uri) {
//         // Transcribe with Google Speech API (LINEAR16)
//         const transcript = await transcribeWithGoogle(uri);
//         setUserText(transcript);

//         if (transcript.trim()) {
//           processVoiceCommand(transcript);
//         } else {
//           speakResponse("I didn't catch that. Please try again.");
//         }

//         // Clean up the temporary file
//         try {
//           await FileSystem.deleteAsync(uri);
//         } catch (cleanupError) {
//           console.warn("Could not clean up recording file:", cleanupError);
//         }
//       }
//     } catch (error) {
//       console.error("Error stopping recording or transcribing:", error);
//       setIsListening(false);
//       stopPulseAnimation();
//       if (silenceTimer) clearTimeout(silenceTimer);
//       if (maxRecordingTimer) clearTimeout(maxRecordingTimer);
//       speakResponse(
//         "Sorry, I couldn't process your request. Please try again."
//       );
//     }
//   };

//   const speakResponse = (text: string) => {
//     setIsAISpeaking(true);
//     setAiResponse(text);
//     Speech.speak(text, {
//       language: "en-US",
//       pitch: 1.0,
//       rate: 0.85,
//       onDone: () => setIsAISpeaking(false),
//       onError: () => setIsAISpeaking(false),
//     });
//   };

//   // Animated styles
//   const gifAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: scale.value * pulseValue.value }],
//     };
//   });

//   // Press animations
//   const handlePressIn = () => {
//     scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
//   };

//   const handlePressOut = () => {
//     scale.value = withSpring(1, { damping: 15, stiffness: 300 });
//   };

//   // Don't render if API key is missing
//   if (!GOOGLE_SPEECH_API_KEY) {
//     return (
//       <View className="bg-gray-100 flex-1 shadow-xs rounded-3xl overflow-hidden">
//         <View className="flex-row justify-center items-center bg-gray-200 p-4 py-9 rounded-xl">
//           <Text className="text-gray-500 text-sm text-center">
//             Voice assistant configuration missing. Please add Google Speech API
//             key to your app configuration.
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View className="bg-white flex-1 shadow-xs rounded-3xl overflow-hidden">
//       <View className="flex-row justify-around gap-6 items-start bg-black p-4 py-9 rounded-xl">
//         <TouchableOpacity
//           className="flex-row items-center justify-between rounded-xl relative"
//           onPress={handleVoiceInteraction}
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//           activeOpacity={0.8}
//         >
//           <Animated.View style={gifAnimatedStyle}>
//             <Image
//               source={require("@/assets/bruno.gif")}
//               style={{ width: 150, height: 150 }}
//               className="bg-blend-multiply rounded-xl"
//             />
//           </Animated.View>
//         </TouchableOpacity>

//         {/* Right Side - Conversation Display */}
//         <View className="flex-col h-full justify-center gap-4 items-center flex-1">
//           {(isListening || isTranscribing) && (
//             <Text className="text-white text-sm">
//               {isTranscribing ? userText : "Listening... (tap to stop)"}
//             </Text>
//           )}

//           {/* Voice Status */}
//           {!isListening && !isTranscribing && (
//             <Text className="text-white text-sm leading-5">
//               {aiResponse.slice(0, 40)}
//             </Text>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// export default Bruno;
