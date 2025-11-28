import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import api from '../../lib/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Loader2 } from 'lucide-react';

interface CandidateProfile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    resumeUrl?: string;
    skills: string[];
    experienceYears: number;
    hourlyRate: number;
    bio: string;
}

export const ProfilePage = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<CandidateProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/candidates/me');
            setProfile(response.data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
            setError('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            await api.patch('/candidates/me', {
                phone: profile?.phone,
                address: profile?.address,
                city: profile?.city,
                state: profile?.state,
                zipCode: profile?.zipCode,
                country: profile?.country,
                bio: profile?.bio,
                hourlyRate: Number(profile?.hourlyRate),
                experienceYears: Number(profile?.experienceYears),
            });
            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
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
                <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">
                    Manage your personal information and professional details.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Sidebar Card */}
                <Card className="md:col-span-4">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-2xl">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <h3 className="mt-4 text-xl font-semibold">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                            <div className="mt-4 flex w-full flex-col space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Role</span>
                                    <span className="font-medium">{user?.role}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Member since</span>
                                    <span className="font-medium">2023</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                <Card className="md:col-span-8">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your contact details and professional info.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input
                                        value={profile?.phone || ''}
                                        onChange={(e) => setProfile(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Hourly Rate ($)</label>
                                    <Input
                                        type="number"
                                        value={profile?.hourlyRate || ''}
                                        onChange={(e) => setProfile(prev => prev ? ({ ...prev, hourlyRate: Number(e.target.value) }) : null)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input
                                    value={profile?.address || ''}
                                    onChange={(e) => setProfile(prev => prev ? ({ ...prev, address: e.target.value }) : null)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City</label>
                                    <Input
                                        value={profile?.city || ''}
                                        onChange={(e) => setProfile(prev => prev ? ({ ...prev, city: e.target.value }) : null)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State</label>
                                    <Input
                                        value={profile?.state || ''}
                                        onChange={(e) => setProfile(prev => prev ? ({ ...prev, state: e.target.value }) : null)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Zip Code</label>
                                    <Input
                                        value={profile?.zipCode || ''}
                                        onChange={(e) => setProfile(prev => prev ? ({ ...prev, zipCode: e.target.value }) : null)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <Input
                                        value={profile?.country || ''}
                                        onChange={(e) => setProfile(prev => prev ? ({ ...prev, country: e.target.value }) : null)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bio</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={profile?.bio || ''}
                                    onChange={(e) => setProfile(prev => prev ? ({ ...prev, bio: e.target.value }) : null)}
                                />
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}
                            {success && <p className="text-sm text-green-500">{success}</p>}

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
