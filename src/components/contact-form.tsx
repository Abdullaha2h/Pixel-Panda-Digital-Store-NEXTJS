'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsSuccess(true);
                toast.success('Message sent successfully!');
                (e.target as HTMLFormElement).reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-8">
                    Thank you for reaching out. We'll get back to you shortly.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Send another message
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold">Name</label>
                    <Input name="name" placeholder="Your Name" required className="h-10 bg-background border-border text-sm" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold">Email</label>
                    <Input name="email" type="email" placeholder="Email Address" required className="h-10 bg-background border-border text-sm" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold">Subject</label>
                <Input name="subject" placeholder="What is this about?" required className="h-10 bg-background border-border text-sm" />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold">Message</label>
                <Textarea name="message" placeholder="How can we help?" required className="min-h-[100px] bg-background border-border resize-none text-sm" />
            </div>

            <Button disabled={isSubmitting} type="submit" className="w-full h-10 text-base font-bold">
                {isSubmitting ? (
                    <>Sending... <Loader2 className="h-4 w-4 ml-2 animate-spin" /></>
                ) : (
                    <>Send Message <Send className="h-4 w-4 ml-2" /></>
                )}
            </Button>
        </form>
    );
}
