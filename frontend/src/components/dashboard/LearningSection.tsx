import { motion } from "framer-motion";
import { PlayCircle, Clock, Award } from "lucide-react";
import { Button } from "../ui/button";

const courses = [
    {
        id: 1,
        title: "English Communication & Business Speaking Certification",
        image: "/courses/english-comm.jpg",
        duration: "4h 30m",
        modules: 12,
        progress: 0,
    },
    {
        id: 2,
        title: "Computer & CRM Tool Proficiency Certification",
        image: "/courses/crm-tools.jpg",
        duration: "6h 15m",
        modules: 8,
        progress: 35,
    },
    {
        id: 3,
        title: "Data Privacy, Compliance & Workplace Ethics Certification",
        image: "/courses/data-privacy.png",
        duration: "2h 45m",
        modules: 5,
        progress: 0,
    },
    {
        id: 4,
        title: "Customer Service & Call Handling Certification",
        image: "/courses/customer-service.png",
        duration: "5h 20m",
        modules: 10,
        progress: 100,
    },
];

export const LearningSection = () => {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Learn from the Courses</h2>
                <Button variant="ghost" className="text-primary">
                    View All Courses
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {courses.map((course) => (
                    <motion.div
                        key={course.id}
                        variants={item}
                        className="group relative overflow-hidden rounded-xl glass-card border border-white/20 hover:border-primary/50 transition-colors"
                    >
                        <div className="aspect-video w-full overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <PlayCircle className="h-12 w-12 text-white drop-shadow-lg cursor-pointer" />
                            </div>
                        </div>

                        <div className="p-4 space-y-3">
                            <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
                                {course.title}
                            </h3>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {course.duration}
                                </div>
                                <div className="flex items-center">
                                    <Award className="mr-1 h-3 w-3" />
                                    {course.modules} Modules
                                </div>
                            </div>

                            {course.progress > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Progress</span>
                                        <span>{course.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-secondary/20">
                                        <div
                                            className="h-full rounded-full bg-primary transition-all duration-500"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {course.progress === 0 && (
                                <Button className="w-full h-8 text-xs" variant="secondary">
                                    Start Course
                                </Button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
