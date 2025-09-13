import { Audio } from "expo-av";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import * as Speech from "expo-speech";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Import your Redux hooks and socket
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getSocket } from "@/redux/socket";

// ✅ Import voice commands from utils
import { createVoiceCommands } from "@/utils/voicecommands";

const Bruno = () => {
  const dispatch = useAppDispatch();
  const socket = getSocket();

  // Get Google Speech API key from Expo Constants
  const GOOGLE_SPEECH_API_KEY = Constants.expoConfig?.extra?.googleSpeechKey;

  // Redux state
  const {
    temperature,
    humidity,
    redLedState,
    greenLedState,
    yellowLedState,
    allLightsState,
    motionDetected,
    motionAlerts,
  } = useAppSelector((state) => state.lightSyncState);

  console.log(
    "Google Speech API Key:",
    GOOGLE_SPEECH_API_KEY ? "✅ Loaded" : "❌ Missing"
  );

  // Component states
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiResponse, setAiResponse] = useState(
    "Hi! I'm Bruno, your smart home assistant. Tap me to give voice commands!"
  );
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // ✅ Use useRef for timer to persist across re-renders
  const autoStopTimer = useRef<NodeJS.Timeout | null>(null);

  // Animation values
  const scale = useSharedValue(1);
  const pulseValue = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  // Initialize audio permissions
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === "granted");

        if (status !== "granted") {
          Alert.alert(
            "Voice Commands Unavailable",
            "Bruno's voice features need microphone permissions. You can still use the app without voice commands.",
            [{ text: "OK" }]
          );
        }

        // Configure audio mode for recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (error) {
        console.error("Error initializing audio:", error);
        setHasPermission(false);
      }
    };

    initializeAudio();
  }, []);

  // ✅ Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoStopTimer.current) {
        clearTimeout(autoStopTimer.current);
        autoStopTimer.current = null;
      }
    };
  }, []);

  // ✅ Process voice command using Google Speech-to-Text API
  const transcribeWithGoogle = async (audioUri: string): Promise<string> => {
    if (!GOOGLE_SPEECH_API_KEY) {
      throw new Error("Google Speech API key not found");
    }

    try {
      setIsTranscribing(true);
      setUserText("Converting audio...");

      console.log("🎙️ Processing audio with Google Speech API");

      // Convert audio to base64
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestBody = {
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode: "en-US",
          enableAutomaticPunctuation: true,
          model: "latest_short",
          audioChannelCount: 1,
        },
        audio: {
          content: base64Audio,
        },
      };

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_SPEECH_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Google Speech API error:", errorText);
        throw new Error(`Google Speech API error: ${response.status}`);
      }

      const data = await response.json();
      const transcriptionResult =
        data.results?.[0]?.alternatives?.[0]?.transcript || "";

      console.log("📝 Transcription Result:", transcriptionResult);
      return transcriptionResult.trim();
    } catch (error) {
      console.error("Google Speech transcription error:", error);
      throw error;
    } finally {
      setIsTranscribing(false);
    }
  };

  // ✅ Speech response function
  const speakResponse = (text: string) => {
    setIsAISpeaking(true);
    setAiResponse(text);
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.0,
      rate: 0.85,
      onDone: () => setIsAISpeaking(false),
      onError: () => setIsAISpeaking(false),
    });
  };

  // ✅ Process voice command with imported command patterns
  const processVoiceCommand = useCallback(
    (transcript: string) => {
      console.log("🎙️ Processing command:", transcript);

      if (!transcript || typeof transcript !== "string") {
        console.log("❌ Invalid transcript:", transcript);
        speakResponse("I didn't catch that. Please try again.");
        return;
      }

      const lowerTranscript = transcript.toLowerCase();
      let commandFound = false;

      // ✅ Get command patterns from utils
      const commandPatterns = createVoiceCommands({
        dispatch,
        socket,
        temperature,
        humidity,
        motionDetected,
        motionAlerts,
        speakResponse,
      });

      // Check each command pattern
      for (const command of commandPatterns) {
        for (const pattern of command.patterns) {
          if (pattern.test(lowerTranscript)) {
            console.log("✅ Command matched:", pattern);
            command.action();
            commandFound = true;
            break;
          }
        }
        if (commandFound) break;
      }

      // If no command matched
      if (!commandFound) {
        speakResponse(
          "I didn't understand that command. Try saying 'help' for available commands."
        );
      }
    },
    [temperature, humidity, motionDetected, motionAlerts, dispatch, socket]
  );

  // Animation functions
  const startPulseAnimation = () => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600 }),
        withTiming(0.9, { duration: 600 }),
        withTiming(1.1, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      false
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  };

  const stopPulseAnimation = () => {
    cancelAnimation(pulseValue);
    cancelAnimation(glowOpacity);
    pulseValue.value = withSpring(1, { damping: 15, stiffness: 200 });
    glowOpacity.value = withTiming(0, { duration: 300 });
  };

  // Voice interaction handlers
  const handleVoiceInteraction = () => {
    if (!hasPermission) {
      Alert.alert(
        "Permissions Required",
        "Please enable microphone permissions in your device settings.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!GOOGLE_SPEECH_API_KEY) {
      Alert.alert(
        "Configuration Error",
        "Google Speech API key not found. Please check your app configuration.",
        [{ text: "OK" }]
      );
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ✅ FIXED startListening with proper timer
  const startListening = async () => {
    try {
      setUserText("Listening...");
      setIsListening(true);
      startPulseAnimation();

      const recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;

      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );
      setRecording(newRecording);

      // ✅ CRITICAL FIX: Use current recording state to avoid stale closure
      console.log("⏱️ Setting 3-second auto-stop timer...");
      autoStopTimer.current = setTimeout(async () => {
        console.log("⏱️ 3 seconds reached - auto-stopping...");
        setUserText("Auto-stopping...");

        // ✅ Force stop the recording
        try {
          if (newRecording) {
            await newRecording.stopAndUnloadAsync();
            const uri = newRecording.getURI();
            setRecording(null);
            setIsListening(false);
            stopPulseAnimation();

            if (uri) {
              console.log("🔄 Processing auto-stopped recording...");
              setUserText("Processing...");
              const transcriptionResult = await transcribeWithGoogle(uri);
              setUserText(transcriptionResult);

              if (transcriptionResult.trim()) {
                processVoiceCommand(transcriptionResult);
              } else {
                speakResponse("I didn't catch that. Please try again.");
              }

              try {
                await FileSystem.deleteAsync(uri);
              } catch (cleanupError) {
                console.warn(
                  "Could not clean up recording file:",
                  cleanupError
                );
              }
            }
          }
        } catch (error) {
          console.error("Error in auto-stop:", error);
          setIsListening(false);
          stopPulseAnimation();
          speakResponse("Sorry, there was an error processing your request.");
        }

        // Clear timer
        autoStopTimer.current = null;
      }, 3000);

      console.log("🎙️ Recording started with 3-second auto-stop");
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsListening(false);
      stopPulseAnimation();
      speakResponse("Sorry, I couldn't start listening.");
    }
  };

  // ✅ Simplified stopListening (for manual stop only)
  const stopListening = async () => {
    try {
      if (!recording) return;

      console.log("🛑 Manual stop requested");

      // Clear auto-stop timer if it exists
      if (autoStopTimer.current) {
        clearTimeout(autoStopTimer.current);
        autoStopTimer.current = null;
      }

      setIsListening(false);
      stopPulseAnimation();
      setUserText("Processing...");

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        const transcriptionResult = await transcribeWithGoogle(uri);
        setUserText(transcriptionResult);

        if (transcriptionResult.trim()) {
          processVoiceCommand(transcriptionResult);
        } else {
          speakResponse("I didn't catch that. Please try again.");
        }

        try {
          await FileSystem.deleteAsync(uri);
        } catch (cleanupError) {
          console.warn("Could not clean up recording file:", cleanupError);
        }
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsListening(false);
      stopPulseAnimation();
      speakResponse("Sorry, I couldn't process your request.");
    }
  };

  // Animated styles
  const gifAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value * pulseValue.value }],
    };
  });

  // Press animations
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  // Don't render if API key is missing
  if (!GOOGLE_SPEECH_API_KEY) {
    return (
      <View className="bg-gray-100 flex-1 shadow-xs rounded-3xl overflow-hidden">
        <View className="flex-row justify-center items-center bg-gray-200 p-4 py-9 rounded-xl">
          <Text className="text-gray-500 text-sm text-center">
            Voice assistant configuration missing. Please add Google Speech API
            key to your app configuration.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white flex-1 shadow-xs rounded-3xl overflow-hidden">
      <View className="flex-row justify-around gap-6 items-start bg-black p-4 py-9 rounded-xl">
        <TouchableOpacity
          className="flex-row items-center justify-between rounded-xl relative"
          onPress={handleVoiceInteraction}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
        >
          <Animated.View style={gifAnimatedStyle}>
            <Image
              source={require("@/assets/bruno.gif")}
              style={{ width: 150, height: 150 }}
              className="bg-blend-multiply rounded-xl"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Right Side - Conversation Display */}
        <View className="flex-col h-full justify-center gap-4 items-center flex-1">
          {(isListening || isTranscribing) && (
            <Text className="text-white text-sm">
              {isTranscribing ? userText : "Listening... (3s auto-stop)"}
            </Text>
          )}

          {/* Voice Status */}
          {!isListening && !isTranscribing && (
            <Text className="text-white text-sm leading-5">
              {aiResponse.slice(0, 40)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Bruno;
