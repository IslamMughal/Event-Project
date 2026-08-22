import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: { status: 401, message: 'Authentication required' } }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: { status: 400, message: 'A file is required' } }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to base64 Data URI for direct Cloudinary upload
    const mimeType = (file as File).type || 'image/jpeg';
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${mimeType};base64,${base64Data}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'eventify',
      resource_type: 'image',
    });

    return NextResponse.json({ data: { url: uploadResponse.secure_url } });
  } catch (error: any) {
    console.error('upload error:', error?.message || error);
    return NextResponse.json({ error: { status: 500, message: error?.message || 'Upload failed' } }, { status: 500 });
  }
}
