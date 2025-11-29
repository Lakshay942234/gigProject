import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Loader2 } from 'lucide-react';

interface Application {
    id: string;
    status: string;
    appliedAt: string;
    gig: {
        title: string;
        hourlyRate: number;
    };
}

export const ApplicationsPage = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            // Note: Backend endpoint might need adjustment to match this path
            const response = await api.get('/gigs/my-applications');
            setApplications(response.data);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'default'; // Greenish usually
            case 'REJECTED': return 'destructive';
            case 'PENDING': return 'secondary';
            default: return 'outline';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">My Applications</h2>
                <p className="text-muted-foreground">
                    Track the status of your gig applications.
                </p>
            </div>

            <div className="space-y-4">
                {applications.map((app) => (
                    <Card key={app.id}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h3 className="font-semibold text-lg">{app.gig.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium">₹{app.gig.hourlyRate}/hr</span>
                                <Badge variant={getStatusColor(app.status) as any}>
                                    {app.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {applications.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        You haven't applied to any gigs yet.
                    </div>
                )}
            </div>
        </div>
    );
};
