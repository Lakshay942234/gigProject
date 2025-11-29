import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Loader2, Play, Clock, IndianRupee, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface AcceptedGig {
    id: string;
    gigId: string;
    status: string;
    appliedAt: string;
    gig: {
        id: string;
        title: string;
        description: string;
        payRate: number;
        currency: string;
        processType: string;
        schedule: {
            startDate: string;
            endDate: string;
            startTime: string;
            endTime: string;
            recurringDays: string[];
        };
        sopUrl?: string;
    };
}

export const WorkspacePage = () => {
    const navigate = useNavigate();
    const [acceptedGigs, setAcceptedGigs] = useState<AcceptedGig[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAcceptedGigs();
    }, []);

    const fetchAcceptedGigs = async () => {
        try {
            const response = await api.get("/gigs/my-applications");
            // Filter only APPROVED applications
            const approved = response.data.filter(
                (app: AcceptedGig) => app.status === "APPROVED"
            );
            setAcceptedGigs(approved);
        } catch (err) {
            console.error("Failed to fetch accepted gigs", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartWork = (gigId: string, gigTitle: string) => {
        navigate(`/dashboard/workspace/${gigId}`, {
            state: { gigTitle },
        });
    };

    const isWithinShiftTime = (startTime: string, endTime: string) => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        const shiftStart = startHour * 60 + startMin;
        const shiftEnd = endHour * 60 + endMin;

        // Allow entry 30 minutes before shift
        const earlyStart = shiftStart - 30;

        return currentTime >= earlyStart && currentTime <= shiftEnd;
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">My Workspace</h2>
                <p className="text-muted-foreground">
                    Access your accepted gigs and start working.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {acceptedGigs.map((application) => {
                    const gig = application.gig;
                    const canStart = isWithinShiftTime(
                        gig.schedule.startTime,
                        gig.schedule.endTime
                    );

                    return (
                        <motion.div
                            key={application.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="glass-card border-white/20">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg">{gig.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {gig.description}
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800">
                                            APPROVED
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Gig Details */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {gig.schedule.startTime} - {gig.schedule.endTime}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {gig.payRate}/hr
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 col-span-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {new Date(gig.schedule.startDate).toLocaleDateString()}{" "}
                                                - {new Date(gig.schedule.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Message */}
                                    {!canStart && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                            <p className="text-sm text-amber-800">
                                                🕒 You can start working 30 minutes before your shift (
                                                {gig.schedule.startTime})
                                            </p>
                                        </div>
                                    )}

                                    {/* Start Work Button */}
                                    <Button
                                        className="w-full"
                                        onClick={() => handleStartWork(gig.id, gig.title)}
                                        disabled={!canStart}
                                    >
                                        <Play className="mr-2 h-4 w-4" />
                                        {canStart ? "Start Work" : "Not Available Yet"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}

                {acceptedGigs.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <div className="text-muted-foreground">
                            <p className="text-lg font-medium">No accepted gigs yet</p>
                            <p className="text-sm mt-2">
                                Apply to gigs and wait for admin approval to start working
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => navigate("/dashboard/gigs")}
                            >
                                Browse Available Gigs
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
