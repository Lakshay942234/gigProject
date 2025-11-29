import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle, ArrowLeft, Play } from 'lucide-react';

interface Quiz {
    question: string;
    options: string[];
    correct: number;
}

interface CourseContent {
    id: string;
    type: 'video' | 'document' | 'quiz';
    title: string;
    description: string;
    duration: string;
    videoUrl?: string;
    documentContent?: string;
    quiz?: Quiz[];
}

const coursesData: Record<string, CourseContent> = {
    '1': {
        id: '1',
        type: 'video',
        title: 'Customer Service Fundamentals',
        description: 'Learn the basics of excellent customer service',
        duration: '45 min',
        videoUrl: 'https://youtu.be/9jNdyq-jkhI?si=t51nrW6surc2hAnI', // Real Customer Service Training Video
    },
    '2': {
        id: '2',
        type: 'document',
        title: 'BPO Process Guidelines',
        description: 'Standard operating procedures for BPO operations',
        duration: '30 min',
        documentContent: `
# BPO Process Guidelines

## 1. Introduction
Welcome to our comprehensive BPO Process Guidelines. This document outlines the standard operating procedures that ensure quality and consistency across all operations.

## 2. Core Principles

### 2.1 Quality First
- **Accuracy**: Always prioritize quality over speed. An error-free transaction is better than a fast but incorrect one.
- **Verification**: Double-check all entries before submission. Use the "self-review" technique.
- **Checklists**: Follow the verification checklist for every task type.

### 2.2 Data Security
- **Credentials**: Never share login credentials with anyone, including team leads.
- **Secure Channels**: Use only approved secure channels for data transfer.
- **Reporting**: Report any security concerns or suspicious emails immediately to IT security.
- **Clean Desk Policy**: Ensure no sensitive information is left on your desk when you leave.

### 2.3 Communication
- **Clarity**: Be clear, concise, and professional in all communications.
- **Tone**: Maintain a polite and helpful tone, even in difficult situations.
- **Documentation**: Document all important conversations and decisions in the case notes.

## 3. Daily Operations

### 3.1 Starting Your Shift
1. **Login**: Login to all required systems (CRM, Dialer, Chat tool) 10 minutes before your shift starts.
2. **Notifications**: Check for any urgent notifications or updates from the previous shift.
3. **Queue Review**: Review your task queue and prioritize urgent items.
4. **Briefing**: Attend the daily team briefing (if scheduled) to get updates on targets and process changes.

### 3.2 During Work
- **Workflow**: Follow the assigned workflow for each task. Do not deviate without approval.
- **Status Updates**: Update task status regularly in the system.
- **Breaks**: Take breaks exactly as scheduled to ensure coverage.
- **Assistance**: Ask for help from your Team Lead or SME (Subject Matter Expert) when you encounter a scenario not covered in the SOP.

### 3.3 Ending Your Shift
1. **Pending Tasks**: Complete all pending tasks or hand them over properly.
2. **Logs**: Update work logs and timesheets.
3. **Cleanup**: Clean up your workspace and lock your computer.
4. **Report**: Submit your daily performance report to your supervisor.

## 4. Quality Standards

### 4.1 Accuracy Targets
- **Data Entry**: 99.5% accuracy required.
- **Customer Calls**: 95% customer satisfaction (CSAT) score.
- **Processing Time**: Maintain Average Handling Time (AHT) within SLA limits (e.g., 5 mins per call).

### 4.2 Performance Metrics
- **Response Time**: Answer calls/chats within 10 seconds.
- **First Call Resolution (FCR)**: Resolve the customer's issue in the first interaction whenever possible.
- **Productivity**: Process a minimum of X transactions per hour (varies by project).

## 5. Escalation Process

**When to escalate:**
- Customer specifically requests a supervisor.
- Technical issues prevent you from resolving the case.
- Unusual or suspicious activities detected.
- Policy exceptions are needed to resolve a valid customer issue.

**How to escalate:**
1. **Document**: Document the issue clearly in the ticket, including what you have already tried.
2. **Notify**: Notify your team lead via the internal chat tool or raising your hand.
3. **Follow-up**: Provide the case number to the lead.
4. **Await**: Await instructions or transfer the call as directed.

## 6. Best Practices

✅ **Do:**
- Be proactive in solving problems.
- Stay organized and manage your time well.
- Communicate clearly and effectively.
- Maintain professionalism at all times.
- Follow SOPs strictly to ensure consistency.

❌ **Don't:**
- Skip verification steps to save time.
- Share confidential customer information with unauthorized persons.
- Make unauthorized decisions or promises to customers.
- Ignore quality guidelines or feedback.

## 7. Continuous Improvement

We encourage all team members to:
- Provide feedback on processes that are inefficient.
- Suggest improvements to the SOPs.
- Participate in training sessions and upskilling programs.
- Share knowledge and best practices with the team.

## 8. Contact Information

**Technical Support:** tech@company.com | Ext: 101
**HR Department:** hr@company.com | Ext: 102
**Quality Team:** quality@company.com | Ext: 103
**Emergency Hotline:** 1800-XXX-XXXX

---

**Remember: Quality service is our commitment! Your dedication makes the difference.**
        `.trim(),
    },
    '3': {
        id: '3',
        type: 'quiz',
        title: 'Communication Skills Assessment',
        description: 'Test your communication abilities',
        duration: '20 min',
        quiz: [
            {
                question: 'What is the most important aspect of effective communication?',
                options: ['Speaking loudly', 'Active listening', 'Using complex words', 'Speaking quickly'],
                correct: 1,
            },
            {
                question: 'How should you handle an angry customer?',
                options: ['Argue back', 'Stay calm and empathetic', 'Transfer immediately', 'Hang up'],
                correct: 1,
            },
            {
                question: 'What does "active listening" mean?',
                options: ['Waiting to speak', 'Fully concentrating and understanding', 'Multitasking while listening', 'Interrupting with questions'],
                correct: 1,
            },
            {
                question: 'When should you use professional jargon with customers?',
                options: ['Always', 'Never', 'Only when necessary and explained', 'When showing expertise'],
                correct: 2,
            },
            {
                question: 'What is the best way to clarify customer requirements?',
                options: ['Assume what they mean', 'Ask open-ended questions', 'Wait for them to explain fully', 'Use yes/no questions only'],
                correct: 1,
            },
            {
                question: 'Which of the following is a barrier to effective communication?',
                options: ['Feedback', 'Noise/Distractions', 'Clarity', 'Empathy'],
                correct: 1,
            },
            {
                question: 'In written communication (email/chat), what is crucial?',
                options: ['Using all caps for emphasis', 'Using emojis frequently', 'Proper grammar and spelling', 'Writing very long paragraphs'],
                correct: 2,
            },
            {
                question: 'What is the "tone" of voice?',
                options: ['How loud you speak', 'The emotion and attitude conveyed', 'The speed of speech', 'The language you speak'],
                correct: 1,
            }
        ],
    },
    '4': {
        id: '4',
        type: 'video',
        title: 'Data Entry Best Practices',
        description: 'Master efficiency and accuracy in data entry',
        duration: '35 min',
        videoUrl: 'https://youtu.be/9jNdyq-jkhI?si=t51nrW6surc2hAnI', // Real Data Entry Tips Video
    },
    '5': {
        id: '5',
        type: 'video',
        title: 'Call Handling Techniques',
        description: 'Advanced strategies for managing customer calls',
        duration: '50 min',
        videoUrl: 'https://youtu.be/9jNdyq-jkhI?si=t51nrW6surc2hAnI', // Real Call Handling Video
    },
    '6': {
        id: '6',
        type: 'quiz',
        title: 'Quality Standards Quiz',
        description: 'Verify your understanding of quality requirements',
        duration: '15 min',
        quiz: [
            {
                question: 'What is the minimum accuracy target for data entry?',
                options: ['95%', '98%', '99.5%', '100%'],
                correct: 2,
            },
            {
                question: 'When should you escalate an issue?',
                options: ['Never', 'Only for technical problems', 'When beyond your scope', 'After trying for 1 hour'],
                correct: 2,
            },
            {
                question: 'What should you do before submitting work?',
                options: ['Submit immediately', 'Double-check for errors', 'Ask supervisor', 'Wait 5 minutes'],
                correct: 1,
            },
            {
                question: 'What is "First Call Resolution" (FCR)?',
                options: ['Calling the customer back first', 'Resolving the issue in the first contact', 'Transferring the call first', 'Answering the call first'],
                correct: 1,
            },
            {
                question: 'Why is data security important?',
                options: ['It is not important', 'To protect customer privacy and company reputation', 'Only to avoid getting fired', 'Because IT said so'],
                correct: 1,
            }
        ],
    },
};

export const CourseViewerPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const course = courseId ? coursesData[courseId] : null;

    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    if (!course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
                <Button onClick={() => navigate('/dashboard/learning')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Learning
                </Button>
            </div>
        );
    }

    const handleQuizSubmit = () => {
        if (!course.quiz) return;

        let correctCount = 0;
        quizAnswers.forEach((answer, index) => {
            if (answer === course.quiz![index].correct) {
                correctCount++;
            }
        });

        const percentage = Math.round((correctCount / course.quiz.length) * 100);
        setScore(percentage);
        setShowResults(true);
    };

    const handleComplete = () => {
        // In a real app, this would save progress to backend
        navigate('/dashboard/learning');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/dashboard/learning')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Button>
                <Badge className="capitalize">{course.type}</Badge>
            </div>

            {/* Course Title */}
            <div>
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-muted-foreground">{course.description}</p>
                <p className="text-sm text-muted-foreground mt-2">Duration: {course.duration}</p>
            </div>

            {/* Video Content */}
            {course.type === 'video' && (
                <Card>
                    <CardContent className="p-0">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                src={course.videoUrl}
                                title={course.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </CardContent>
                    <div className="p-6">
                        <Button onClick={handleComplete} className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Complete
                        </Button>
                    </div>
                </Card>
            )}

            {/* Document Content */}
            {course.type === 'document' && (
                <Card>
                    <CardContent className="p-8">
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                            {course.documentContent}
                        </div>
                    </CardContent>
                    <div className="p-6 border-t">
                        <Button onClick={handleComplete} className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Complete
                        </Button>
                    </div>
                </Card>
            )}

            {/* Quiz Content */}
            {course.type === 'quiz' && course.quiz && (
                <Card>
                    <CardHeader>
                        <CardTitle>Assessment Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!showResults ? (
                            <>
                                {course.quiz.map((q, qIndex) => (
                                    <div key={qIndex} className="border rounded-lg p-4">
                                        <p className="font-medium mb-3">
                                            {qIndex + 1}. {q.question}
                                        </p>
                                        <div className="space-y-2">
                                            {q.options.map((option, oIndex) => (
                                                <label
                                                    key={oIndex}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIndex}`}
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
                                    disabled={quizAnswers.length !== course.quiz.length}
                                    className="w-full"
                                >
                                    Submit Quiz
                                </Button>
                            </>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className={`text-6xl font-bold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                    {score}%
                                </div>
                                <p className="text-xl">
                                    {score >= 70
                                        ? '🎉 Congratulations! You passed!'
                                        : '📚 Keep studying and try again!'}
                                </p>
                                <p className="text-muted-foreground">
                                    You got {Math.round((score / 100) * course.quiz.length)} out of {course.quiz.length} questions correct.
                                </p>
                                <div className="flex gap-4 justify-center pt-4">
                                    {score >= 70 ? (
                                        <Button onClick={handleComplete}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Complete Course
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setQuizAnswers([]);
                                                setShowResults(false);
                                            }}
                                        >
                                            Try Again
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
