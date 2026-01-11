import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Webcam from 'react-webcam';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const VisionBreathing = ({ onClose, onComplete }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState('initializing'); // initializing, exercise_1, exercise_2, completed
    const [feedback, setFeedback] = useState('Align yourself in frame...');
    const [score, setScore] = useState(0);
    const [reps, setReps] = useState(0);
    const [currentExercise, setCurrentExercise] = useState('Calibration');

    // Exercise Constants
    const TARGET_REPS = 3;
    const holdTimer = useRef(0);

    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            },
        });

        pose.setOptions({
            modelComplexity: 1, // 0 is faster, 1 is default, 2 is heavy
            smoothLandmarks: true,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6,
        });

        pose.onResults(onResults);

        if (webcamRef.current && webcamRef.current.video) {
            const camera = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current && webcamRef.current.video) {
                        await pose.send({ image: webcamRef.current.video });
                    }
                },
                width: 640,
                height: 480,
            });
            camera.start();
        }

        return () => {
            pose.close();
        };
    }, []);

    // Refs for logic loop
    const processPoseRef = useRef(null);

    // Breathing States
    const [breathingPhase, setBreathingPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [cycleCount, setCycleCount] = useState(0);
    const TARGET_CYCLES = 3;

    // Update the ref
    useEffect(() => {
        processPoseRef.current = processPose;
    });

    // Breathing Loop Controller
    useEffect(() => {
        if (status === 'breathing') {
            let mounted = true;

            const runBreathingCycle = async () => {
                // Initial Prep
                setBreathingPhase('ready');
                setFeedback("Get comfortable for deep breathing...");
                await new Promise(r => setTimeout(r, 3000));
                if (!mounted) return;

                for (let i = 0; i < TARGET_CYCLES; i++) {
                    setCycleCount(i + 1);

                    // Inhale (4s)
                    setBreathingPhase('inhale');
                    setFeedback("Inhale deeply through nose...");
                    await new Promise(r => setTimeout(r, 4000));
                    if (!mounted) return;

                    // Hold (7s)
                    setBreathingPhase('hold');
                    setFeedback("Hold your breath...");
                    await new Promise(r => setTimeout(r, 7000));
                    if (!mounted) return;

                    // Exhale (8s)
                    setBreathingPhase('exhale');
                    setFeedback("Exhale slowly through mouth...");
                    await new Promise(r => setTimeout(r, 8000));
                    if (!mounted) return;
                }

                if (mounted) {
                    setStatus('completed');
                }
            };

            runBreathingCycle();

            return () => {
                mounted = false;
            };
        }
    }, [status]);

    const onResults = (results) => {
        if (!canvasRef.current || !webcamRef.current || !webcamRef.current.video) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, videoWidth, videoHeight);

        // Draw Only Upper Body Skeleton
        if (results.poseLandmarks) {
            // Indices: 0-10 (Face), 11-12 (Shoulders), 13-14 (Elbows), 15-16 (Wrists)
            const upperBodyIndices = [0, 2, 5, 7, 8, 11, 12, 13, 14, 15, 16];

            // Custom connections for upper body only
            const UPPER_BODY_CONNECTIONS = [
                [11, 12], // Shoulders
                [11, 13], [13, 15], // Left Arm
                [11, 23], [12, 24], // Torso sides (optional, for reference)
                [12, 14], [14, 16], // Right Arm
            ];

            // Draw connections
            drawConnectors(canvasCtx, results.poseLandmarks, UPPER_BODY_CONNECTIONS,
                { color: '#00FF00', lineWidth: 4 });

            // Draw specific landmarks
            upperBodyIndices.forEach(index => {
                const landmark = results.poseLandmarks[index];
                if (landmark) {
                    canvasCtx.beginPath();
                    canvasCtx.arc(landmark.x * videoWidth, landmark.y * videoHeight, 4, 0, 2 * Math.PI);
                    canvasCtx.fillStyle = '#FF0000';
                    canvasCtx.fill();
                }
            });

            // Call the latest version of processPose via ref
            if (processPoseRef.current) {
                processPoseRef.current(results.poseLandmarks);
            }
        }
        canvasCtx.restore();
    };

    const processPose = (landmarks) => {
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const nose = landmarks[0];

        // Strict visibility check for arms
        if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder) return;

        // Calculate Metrics
        // Extension: Distance from Shoulder Y to Wrist Y. 
        // Max range approx 0.5 (half screen). 
        // Normalize: (ShoulderY - WristY) * 2.5 (approx)
        const lExt = Math.max(0, (leftShoulder.y - leftWrist.y));
        const rExt = Math.max(0, (rightShoulder.y - rightWrist.y));
        const avgExtension = (lExt + rExt) / 2;
        const extensionPct = Math.min(100, Math.round(avgExtension * 250)); // Scaling factor tailored for frame

        // Using direct State now (safe due to Ref Pattern)
        if (status === 'initializing') {
            setCurrentExercise('Start Session');

            // Simpler Check: Are wrists above the nose?
            // REMEMBER: Y is 0 at Top, 1 at Bottom. So "Above" means Wrist.y < Nose.y
            const isHandsUp = leftWrist.y < nose.y && rightWrist.y < nose.y;

            setFeedback(isHandsUp
                ? `Perfect! Hold... ${holdTimer.current}/10`
                : "Raise hands above nose!");

            // Debug String
            setDebugInfo(`State: ${status} | HandsUp: ${isHandsUp} | Timer: ${holdTimer.current}`);

            // Start Trigger
            if (isHandsUp) {
                holdTimer.current += 1;
                if (holdTimer.current > 10) { // Super fast start (0.3s)
                    setStatus('exercise_1');
                    setReps(0);
                    holdTimer.current = 0;
                }
            } else {
                holdTimer.current = 0;
            }
        }
        else if (status === 'exercise_1') {
            setCurrentExercise('Sky Reaches');
            setDebugInfo(`State: ${status} | Ext: ${extensionPct}% | Reps: ${reps}`);

            if (extensionPct > 80) {
                setFeedback("Excellent Reach!");
                holdTimer.current += 1;
                if (holdTimer.current > 40) { // Hold for ~1.3s
                    setReps(prev => prev + 1);
                    setScore(s => s + 15);
                    holdTimer.current = 0;
                    setFeedback("Relax Down.");
                }
            } else {
                setFeedback(reps < TARGET_REPS ? `Reach Higher! (${extensionPct}%)` : "Great Job!");
                holdTimer.current = 0;
            }

            if (reps >= TARGET_REPS) {
                setTimeout(() => {
                    setStatus('exercise_2');
                    setReps(0);
                }, 1000);
            }
        }
        else if (status === 'exercise_2') {
            setCurrentExercise('Chest Openers');

            // Logic: Cactus Arms - Elbows high, wrists high but not fully extended
            // Check Elbow Y vs Shoulder Y
            const lElbowLevel = Math.abs(leftElbow.y - leftShoulder.y) < 0.15;
            const rElbowLevel = Math.abs(rightElbow.y - rightShoulder.y) < 0.15;

            // "Openness" could be X distance between wrists?
            const wristDist = Math.abs(leftWrist.x - rightWrist.x);
            const openPct = Math.min(100, Math.round(wristDist * 150));

            setDebugInfo(`State: ${status} | Open: ${openPct}% | Reps: ${reps}`);

            if (lElbowLevel && rElbowLevel && openPct > 60) {
                setFeedback("Feel the stretch...");
                holdTimer.current += 1;
                if (holdTimer.current > 40) { // Hold for ~1.3s
                    setReps(prev => prev + 1);
                    setScore(s => s + 15);
                    holdTimer.current = 0;
                    setFeedback("Relax.");
                }
            } else {
                setFeedback(reps < TARGET_REPS ? `Elbows Up & Open! (${openPct}%)` : "All Done!");
                holdTimer.current = 0;
            }

            if (reps >= TARGET_REPS) {
                setTimeout(() => {
                    setStatus('breathing');
                    setReps(0);
                }, 1000);
            }
        }
        else if (status === 'breathing') {
            setCurrentExercise('4-7-8 Breathing');
            // Monitor Shoulders: They should stay relatively still/down even during inhale
            // Only warn if sudden upward movement detected

            // We can compare against a baseline, but simpler is just stability check
            setDebugInfo(`Phase: ${breathingPhase} | Cycle: ${cycleCount}/${TARGET_CYCLES}`);

            if (breathingPhase === 'inhale') {
                // If shoulders rise too much (y decreases), warn
                // This is subtle, maybe just skip for now to avoid false positives
                // or just positive reinforcement "Keep shoulders relaxed"
            }
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black flex flex-col md:flex-row h-screen w-screen overflow-hidden overscroll-none touch-none">
            {/* Sidebar / Topbar for Mobile */}
            <div className="md:w-80 w-full bg-neutral-900 border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col items-center justify-between p-6 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${status === 'initializing' ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'}`}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white">Smart Coach</h2>
                        <div className="text-xs font-mono text-white/50 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            LIVE C.V.
                        </div>
                    </div>
                </div>

                <div className="glass px-4 py-2 rounded-full hidden md:block">
                    <span className="font-mono text-xl font-bold">Reps: {reps}/{TARGET_REPS}</span>
                </div>

                {/* Mobile Rep Counter */}
                <div className="md:hidden glass px-3 py-1 rounded-full">
                    <span className="font-mono text-sm font-bold">{reps}/{TARGET_REPS}</span>
                </div>

                <button
                    onClick={onClose}
                    className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1 bg-neutral-900 overflow-hidden flex items-center justify-center">
                <Webcam
                    ref={webcamRef}
                    mirrored
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    playsInline
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* HUD Overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 w-full max-w-lg mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentExercise}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="bg-black/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col items-center w-full shadow-2xl"
                        >
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
                                {currentExercise}
                            </h2>
                            <div className="text-lg md:text-xl font-medium text-secondary mb-4">
                                {feedback}
                            </div>

                            {/* Manual Override for Calibration */}
                            {status === 'initializing' && (
                                <button
                                    onClick={() => {
                                        setStatus('exercise_1');
                                        setReps(0);
                                    }}
                                    className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold text-white/60 hover:text-white transition-colors border border-white/5"
                                >
                                    Skip Calibration
                                </button>
                            )}

                            {/* Debug Info */}
                            <div className="mt-4 text-[10px] font-mono text-white/40 bg-black/50 p-2 rounded max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                                DEBUG: {debugInfo}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Completion Screen */}
            {status === 'completed' && (
                <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <CheckCircle className="text-primary mb-6 animate-bounce" size={64} />
                    <h2 className="text-4xl font-bold mb-2">Session Complete</h2>
                    <p className="text-white/60 mb-8">Your breathing harmony score</p>
                    <div className="text-8xl font-black text-primary mb-8">{score.toFixed(0)}%</div>
                    <button
                        onClick={onClose}
                        className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>,
        document.body
    );
};

export default VisionBreathing;
