import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
    if (!supabaseServiceKey) {
        return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file provided' }, { status: 400 });
        }

        const BUCKET_NAME = 'products';

        // Ensure bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.find(b => b.name === BUCKET_NAME);

        if (!bucketExists) {
            await supabase.storage.createBucket(BUCKET_NAME, {
                public: true,
                fileSizeLimit: 10485760,
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
            });
        }

        // Upload
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            throw new Error(uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { message: 'Upload failed' },
            { status: 500 }
        );
    }
}
