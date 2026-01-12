'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';

export default function SignupPage() {
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signup(formData);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

            <div className="w-full max-w-md px-4">
                <div className="mb-8 flex justify-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
                            <Image
                                src="/Logo.svg"
                                alt="Pixel Panda Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-purple-600">
                            Create an account
                        </CardTitle>
                        <CardDescription>
                            Join Pixel Panda and start trading today
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-background/50 border-input/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-background/50 border-input/50 focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-background/50 border-input/50 focus:border-primary"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-linear-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all font-semibold shadow-lg shadow-primary/20"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="ml-1 text-primary hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
