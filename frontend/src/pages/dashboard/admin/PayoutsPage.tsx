import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Loader2, Check, X } from 'lucide-react';

interface Payout {
    id: string;
    amount: number;
    status: string;
    requestedAt: string;
    wallet: {
        candidate: {
            user: {
                firstName: string;
                lastName: string;
                email: string;
            }
        }
    };
    paymentMethod: string;
}

export const PayoutsPage = () => {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const response = await api.get('/payments/payouts?status=PENDING');
            setPayouts(response.data);
        } catch (err) {
            console.error('Failed to fetch payouts', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'COMPLETED' | 'FAILED') => {
        setProcessingId(id);
        try {
            await api.patch(`/payments/payout/${id}`, { status });
            // Remove from list or update status locally
            setPayouts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Failed to update payout', err);
        } finally {
            setProcessingId(null);
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
                <h2 className="text-2xl font-bold tracking-tight">Payout Requests</h2>
                <p className="text-muted-foreground">
                    Review and process candidate payout requests.
                </p>
            </div>

            <div className="space-y-4">
                {payouts.map((payout) => (
                    <Card key={payout.id}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">
                                    ${payout.amount.toFixed(2)} - {payout.paymentMethod}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Requested by {payout.wallet.candidate.user.firstName} {payout.wallet.candidate.user.lastName} ({payout.wallet.candidate.user.email})
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(payout.requestedAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleUpdateStatus(payout.id, 'FAILED')}
                                    disabled={processingId === payout.id}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus(payout.id, 'COMPLETED')}
                                    disabled={processingId === payout.id}
                                >
                                    {processingId === payout.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                                    Approve
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {payouts.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No pending payout requests.
                    </div>
                )}
            </div>
        </div>
    );
};
