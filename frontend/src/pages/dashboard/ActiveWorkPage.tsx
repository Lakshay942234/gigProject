import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ZeptoChatInterface } from "../../components/dashboard/ZeptoChatInterface";
import { AlertTriangle, X, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export const ActiveWorkPage = () => {
    const { } = useParams();
    const location = useLocation();
    //const navigate = useNavigate();
    const navigate = useNavigate();

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [escapeAttempts, setEscapeAttempts] = useState(0);
    const [workStarted, setWorkStarted] = useState(false);
    const [showPrep, setShowPrep] = useState(true);

    const gigTitle = location.state?.gigTitle || "Work Session";

    // Demo prep materials
    const prepMaterials = {
        title: "Customer Support Guidelines",
        content: `
# Welcome to Your Shift!

## Key Points to Remember:

1. **Be Professional**: Always greet customers warmly
2. **Active Listening**: Let customers explain their issues fully
3. **Clear Communication**: Use simple, jargon-free language
4. **Empathy**: Show understanding for customer concerns
5. **Follow SOPs**: Stick to standard operating procedures

## Common Issues & Solutions:

- **Password Reset**: Guide through email verification
    - **Billing Questions**: Check account history first
        - **Technical Issues**: Follow troubleshooting checklist

Good luck with your shift!
        `.trim(),
        quiz: [
            {
                question: "What should you do first when a customer calls?",
                options: [
                    "Greet them warmly",
                    "Ask for account number",
                    "Transfer to supervisor",
                    "Put them on hold",
                ],
                correct: 0,
            },
            {
                question: "How should you communicate with customers?",
                options: [
                    "Use technical terms",
                    "Speak quickly",
                    "Use simple language",
                    "Be formal only",
                ],
                correct: 2,
            },
            {
                question: "What's the first step for password reset?",
                options: [
                    "Create new password",
                    "Email verification",
                    "Call supervisor",
                    "None",
                ],
                correct: 1,
            },
        ],
    };

    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    // Fullscreen API handling
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement
            );

            setIsFullscreen(isCurrentlyFullscreen);

            // If fullscreen exited during work session, show alert
            if (workStarted && !isCurrentlyFullscreen) {
                setShowAlert(true);
                setEscapeAttempts((prev) => prev + 1);

                setTimeout(() => {
                    setShowAlert(false);
                }, 5000);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener(
                "webkitfullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "mozfullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "MSFullscreenChange",
                handleFullscreenChange
            );
        };
    }, [workStarted]);

    const enterFullscreen = () => {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
            (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).mozRequestFullScreen) {
            (elem as any).mozRequestFullScreen();
        } else if ((elem as any).msRequestFullscreen) {
            (elem as any).msRequestFullscreen();
        }
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    };

    const handleStartWork = () => {
        setShowPrep(false);
        setWorkStarted(true);
        setTimeout(() => {
            enterFullscreen();
        }, 500);
    };

    const handleQuizSubmit = () => {
        let score = 0;
        quizAnswers.forEach((answer, index) => {
            if (answer === prepMaterials.quiz[index].correct) {
                score++;
            }
        });

        const percentage = (score / prepMaterials.quiz.length) * 100;
        setQuizScore(percentage);
        setQuizCompleted(true);
    };

    const handleEndWork = () => {
        if (window.confirm("Are you sure you want to end your work session?")) {
            exitFullscreen();
            navigate("/dashboard/workspace");
        }
    };

    if (showPrep) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-4">Pre-Shift Preparation</h1>
                        <p className="text-muted-foreground mb-6">
                            Please review the materials and complete the quiz before starting
                            work.
                        </p>

                        {/* Reading Material */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {prepMaterials.title}
                            </h2>
                            <div className="prose max-w-none">
                                <ReactMarkdown>{prepMaterials.content}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Quiz */}
                        {!quizCompleted ? (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">Quick Knowledge Check</h3>
                                {prepMaterials.quiz.map((q, qIndex) => (
                                    <div key={qIndex} className="bg-white border rounded-lg p-4">
                                        <p className="font-medium mb-3">
                                            {qIndex + 1}. {q.question}
                                        </p>
                                        <div className="space-y-2">
                                            {q.options.map((option, oIndex) => (
                                                <label
                                                    key={oIndex}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIndex}`}
                                                        value={oIndex}
                                                        checked={quizAnswers[qIndex] === oIndex}
                                                        onChange={() => {
                                                            const newAnswers = [...quizAnswers];
                                                            newAnswers[qIndex] = oIndex;
                                                            setQuizAnswers(newAnswers);
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span>{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    onClick={handleQuizSubmit}
                                    disabled={quizAnswers.length !== prepMaterials.quiz.length}
                                    className="w-full"
                                >
                                    Submit Quiz
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div
                                    className={`text-4xl font-bold ${quizScore >= 70 ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {quizScore}%
                                </div>
                                <p className="text-lg">
                                    {quizScore >= 70
                                        ? "✅ Great job! You're ready to start work."
                                        : "❌ Please review the materials and try again."}
                                </p>
                                {quizScore >= 70 ? (
                                    <Button onClick={handleStartWork} size="lg" className="mt-4">
                                        Start Work Session
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            setQuizCompleted(false);
                                            setQuizAnswers([]);
                                        }}
                                        variant="outline"
                                    >
                                        Try Again
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
            {/* Red Alert Overlay */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-red-600/90 z-50 flex items-center justify-center"
                    >
                        <div className="text-center text-white space-y-4">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <AlertTriangle className="h-24 w-24 mx-auto" />
                            </motion.div>
                            <h2 className="text-4xl font-bold">
                                ⚠️ FULLSCREEN EXIT DETECTED!
                            </h2>
                            <p className="text-xl">
                                Please return to fullscreen mode immediately
                            </p>
                            <p className="text-lg">Escape attempts: {escapeAttempts}</p>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={enterFullscreen}
                                className="mt-4"
                            >
                                <Maximize className="mr-2" />
                                Return to Fullscreen
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Bar with Controls */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
                <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-800">{gigTitle}</h2>
                        <span className="text-sm text-gray-500">Work Session Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isFullscreen && (
                            <Button onClick={enterFullscreen} variant="outline" size="sm">
                                <Maximize className="mr-2 h-4 w-4" />
                                Enter Fullscreen
                            </Button>
                        )}
                        <Button onClick={handleEndWork} variant="destructive" size="sm">
                            <X className="mr-2 h-4 w-4" />
                            End Session
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Split Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Chat Interface - Left Side (50%) */}
                <div className="w-1/2 h-full bg-white border-r border-gray-200">
                    <ZeptoChatInterface />
                </div>

                {/* Sidebar Space - Right Side (50%) */}
                <div className="w-1/2 h-full bg-gray-50 p-6 overflow-auto">
                    <div className="text-center text-gray-400 mt-12">
                        <p className="text-sm">Sidebar Coming Soon</p>
                        <p className="text-xs mt-2">Customer info and tools will appear here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
