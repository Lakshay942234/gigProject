import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { BookOpen, Video, FileText, CheckCircle, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'document' | 'quiz';
    duration: string;
    completed: boolean;
}

const demoCourses: Course[] = [
    {
        id: '1',
        title: 'Customer Service Fundamentals',
        description: 'Learn the basics of excellent customer service, including communication skills, empathy, and problem-solving.',
        type: 'video',
        duration: '45 min',
        completed: true
    },
    {
        id: '2',
        title: 'BPO Process Guidelines',
        description: 'Understand the standard operating procedures for BPO operations and quality management.',
        type: 'document',
        duration: '30 min',
        completed: false
    },
    {
        id: '3',
        title: 'Communication Skills Assessment',
        description: 'Test your communication abilities with this comprehensive quiz.',
        type: 'quiz',
        duration: '20 min',
        completed: false
    },
    {
        id: '4',
        title: 'Data Entry Best Practices',
        description: 'Master efficiency and accuracy in data entry tasks.',
        type: 'video',
        duration: '35 min',
        completed: true
    },
    {
        id: '5',
        title: 'Call Handling Techniques',
        description: 'Advanced strategies for managing customer calls effectively.',
        type: 'video',
        duration: '50 min',
        completed: false
    },
    {
        id: '6',
        title: 'Quality Standards Quiz',
        description: 'Verify your understanding of quality requirements and KPIs.',
        type: 'quiz',
        duration: '15 min',
        completed: false
    }
];

export const LearningPage = () => {
    const [courses] = useState<Course[]>(demoCourses);
    const [filter, setFilter] = useState<'all' | 'video' | 'document' | 'quiz'>('all');

    const filteredCourses = courses.filter(course =>
        filter === 'all' ? true : course.type === filter
    );

    const completedCount = courses.filter(c => c.completed).length;
    const totalCount = courses.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    const getIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="h-5 w-5" />;
            case 'document':
                return <FileText className="h-5 w-5" />;
            case 'quiz':
                return <BookOpen className="h-5 w-5" />;
            default:
                return <BookOpen className="h-5 w-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'document':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'quiz':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Learning Center</h2>
                <p className="text-muted-foreground">
                    Enhance your skills with courses, tutorials, and assessments.
                </p>
            </div>

            {/* Progress Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Progress</CardTitle>
                    <CardDescription>Keep learning to unlock more opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Completed: {completedCount} / {totalCount}</span>
                            <span className="font-semibold">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div
                                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['all', 'video', 'document', 'quiz'].map((type) => (
                    <Button
                        key={type}
                        variant={filter === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(type as any)}
                        className="capitalize"
                    >
                        {type}
                    </Button>
                ))}
            </div>

            {/* Courses Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {filteredCourses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="glass-card border-white/20 h-full flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className={`p-2 rounded-lg ${getTypeColor(course.type)}`}>
                                            {getIcon(course.type)}
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {course.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {course.completed && (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize">
                                            {course.type}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">
                                            {course.duration}
                                        </span>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={course.completed ? 'outline' : 'default'}
                                        disabled
                                    >
                                        {course.completed ? (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <Play className="mr-2 h-4 w-4" />
                                                Start
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No courses found for this filter.
                </div>
            )}

            {/* Coming Soon Notice */}
            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
                <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg mb-2">More Content Coming Soon!</h3>
                    <p className="text-muted-foreground text-sm">
                        We're constantly adding new courses and materials to help you grow your skills.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
