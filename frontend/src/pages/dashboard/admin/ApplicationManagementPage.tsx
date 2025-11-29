import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Loader2, Check, X, User, Briefcase, Mail, Phone as PhoneIcon, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Application {
    id: string;
    gigId: string;
    candidateId: string;
    status: 'APPLIED' | 'APPROVED' | 'REJECTED';
    appliedAt: string;
    gig: {
        id: string;
        title: string;
        processType: string;
        payRate: number;
        status: string;
    };
    candidate: {
        id: string;
        versantScore?: number;
        qualifiedToWork: boolean;
        phone?: string;
        bio?: string;
        user: {
            email: string;
            firstName: string;
            lastName: string;
            phone?: string;
        };
    };
}

export const ApplicationManagementPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'APPLIED' | 'APPROVED' | 'REJECTED'>('APPLIED');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/gigs/applications');
            setApplications(response.data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccept = async (id: string) => {
        setProcessingId(id);
        try {
            await api.put(`/gigs/applications/${id}/accept`);
            setApplications(prev =>
                prev.map(app =>
                    app.id === id ? { ...app, status: 'APPROVED' as const } : app
                )
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to accept application');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            await api.put(`/gigs/applications/${id}/reject`);
            setApplications(prev =>
                prev.map(app =>
                    app.id === id ? { ...app, status: 'REJECTED' as const } : app
                )
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to reject application');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredApplications = applications.filter(app =>
        filter === 'ALL' ? true : app.status === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPLIED':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'APPROVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
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
                <h2 className="text-2xl font-bold tracking-tight">Application Management</h2>
                <p className="text-muted-foreground">
                    Review and manage candidate applications for gigs.
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(['ALL', 'APPLIED', 'APPROVED', 'REJECTED'] as const).map((status) => (
                    <Button
                        key={status}
                        variant={filter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter(status)}
                    >
                        {status} (
                        {status === 'ALL'
                            ? applications.length
                            : applications.filter(app => app.status === status).length}
                        )
                    </Button>
                ))}
            </div>

            {/* Applications List */}
            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredApplications.map((application) => (
                        <motion.div
                            key={application.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            layout
                        >
                            <Card className="glass-card border-white/20">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                <Briefcase className="h-5 w-5 text-primary" />
                                                {application.gig.title}
                                            </CardTitle>
                                            <p className="text-sm text-muted-foreground">
                                                {application.gig.processType} • ₹{application.gig.payRate}/hr
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(application.status)}>
                                            {application.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Candidate Info */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Candidate Details
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Name:</span>
                                                    <span>
                                                        {application.candidate.user.firstName}{' '}
                                                        {application.candidate.user.lastName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span>{application.candidate.user.email}</span>
                                                </div>
                                                {application.candidate.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                                        <span>{application.candidate.phone}</span>
                                                    </div>
                                                )}
                                                {application.candidate.versantScore && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Versant:</span>
                                                        <Badge variant="outline">
                                                            {application.candidate.versantScore}
                                                        </Badge>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Qualified:</span>
                                                    <Badge
                                                        variant={
                                                            application.candidate.qualifiedToWork
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {application.candidate.qualifiedToWork ? 'Yes' : 'No'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Application Info */}
                                        <div className="space-y-3">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Application Info
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Applied:</span>
                                                    <span>
                                                        {new Date(application.appliedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {application.candidate.bio && (
                                                    <div className="mt-2">
                                                        <p className="font-medium mb-1">Bio:</p>
                                                        <p className="text-muted-foreground">
                                                            {application.candidate.bio}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            {application.status === 'APPLIED' && (
                                                <div className="flex gap-2 mt-4">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleAccept(application.id)}
                                                        disabled={processingId === application.id}
                                                    >
                                                        {processingId === application.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Check className="h-4 w-4 mr-2" />
                                                                Accept
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="flex-1"
                                                        onClick={() => handleReject(application.id)}
                                                        disabled={processingId === application.id}
                                                    >
                                                        {processingId === application.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <X className="h-4 w-4 mr-2" />
                                                                Reject
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredApplications.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No {filter.toLowerCase()} applications found.
                    </div>
                )}
            </div>
        </div>
    );
};
