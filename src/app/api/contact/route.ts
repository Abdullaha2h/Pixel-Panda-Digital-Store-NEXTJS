import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            console.error('RESEND_API_KEY is missing. Falling back to console simulation.');
            console.log('--- Simulation: New Contact Form Submission ---');
            console.log(`From: ${name} (${email})`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);
            return NextResponse.json({ message: 'Simulation: Email logged to console' }, { status: 200 });
        }

        const resend = new Resend(apiKey);

        const { data, error } = await resend.emails.send({
            from: 'Pixel Panda <onboarding@resend.dev>',
            to: 'abdullaha2hh2a@gmail.com',
            subject: `New Contact: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email,
        });

        if (error) {
            console.error('Resend API Error:', JSON.stringify(error, null, 2));

            // Map validation errors to "Invalid Information"
            const isValidationError = error.message?.toLowerCase().includes('invalid') ||
                error.name === 'validation_error';

            const displayError = isValidationError
                ? 'Invalid Information: Please check your email and form fields.'
                : error.message;

            return NextResponse.json({ error: displayError }, { status: 400 });
        }

        console.log('Resend Success Response:', JSON.stringify(data, null, 2));
        return NextResponse.json({ message: 'Email sent successfully', id: data?.id }, { status: 200 });
    } catch (error) {
        console.error('Error in contact API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
