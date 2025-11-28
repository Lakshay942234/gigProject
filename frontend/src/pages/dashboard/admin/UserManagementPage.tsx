import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Loader2, User as UserIcon, Shield } from 'lucide-react';
import { type User } from '../../../types/auth';

export const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'destructive';
            case 'OPERATIONS': return 'default';
            case 'QA': return 'secondary';
            case 'AGENT': return 'outline';
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">
                        View and manage platform users and their roles.
                    </p>
                </div>
                <Button>Add User</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                    <UserIcon className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-medium">{user.firstName} {user.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={getRoleBadgeVariant(user.role) as any} className="flex w-fit items-center gap-1">
                                                {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">{user.email}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
