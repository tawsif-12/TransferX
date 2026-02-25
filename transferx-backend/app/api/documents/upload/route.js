import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * POST /api/documents/upload
 * Upload a document (multipart form data)
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const formData = await request.formData();
    const file = formData.get('file');
    const documentType = formData.get('documentType');

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    if (!documentType) {
      return errorResponse('Document type is required', 400);
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const filename = `${authUser.userId}_${timestamp}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save document record in database
    const document = await prisma.playerDocument.create({
      data: {
        userId: authUser.userId,
        documentType,
        fileName: originalName,
        filePath: `/uploads/${filename}`,
        fileSize: buffer.length,
        mimeType: file.type,
        status: 'PENDING',
      },
    });

    return successResponse(document, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
