import { useEffect, useState } from 'react';
import api from '../../lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Loader2, DollarSign, Clock, MapPin } from 'lucide-react';

interface Gig {
    id: string;
    title: string;
    description: string;
    hourlyRate: number;
    status: string;
    requiredSkills: string[];
    location: string;
    duration: string;
}

export const GigBoardPage = () => {
    const [gigs, setGigs] = useState<Gig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [applyingId, setApplyingId] = useState<string | null>(null);

    useEffect(() => {
        fetchGigs();
    }, []);

    const fetchGigs = async () => {
        try {
            const response = await api.get('/gigs');
            setGigs(response.data);
        } catch (err) {
            console.error('Failed to fetch gigs', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async (gigId: string) => {
        setApplyingId(gigId);
        try {
            await api.post(`/gigs/${gigId}/apply`);
            // Optionally refresh gigs or show success message
            alert('Application submitted successfully!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to apply');
        } finally {
            setApplyingId(null);
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
                <h2 className="text-2xl font-bold tracking-tight">Available Gigs</h2>
                <p className="text-muted-foreground">
                    Browse and apply for opportunities that match your skills.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gigs.map((gig) => (
                    <Card key={gig.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{gig.title}</CardTitle>
                                <Badge variant={gig.status === 'OPEN' ? 'default' : 'secondary'}>
                                    {gig.status}
                                </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                                {gig.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    ${gig.hourlyRate}/hr
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    {gig.duration || 'Ongoing'}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {gig.location || 'Remote'}
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {gig.requiredSkills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleApply(gig.id)}
                                disabled={applyingId === gig.id}
                            >
                                {applyingId === gig.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Apply Now
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {gigs.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No gigs available at the moment. Check back later!
                    </div>
                )}
            </div>
        </div>
    );
};
