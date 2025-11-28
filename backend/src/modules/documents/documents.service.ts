import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from '../../database/prisma.service';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import 'multer';

@Injectable()
export class DocumentsService {
    private readonly logger = new Logger(DocumentsService.name);
    private s3Client: S3Client;
    private bucketName: string;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.bucketName = this.configService.get<string>('MINIO_BUCKET') || 'bpo-documents';

        this.s3Client = new S3Client({
            region: 'us-east-1', // MinIO requires a region, though it doesn't matter which
            endpoint: `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}`,
            forcePathStyle: true, // Required for MinIO
            credentials: {
                accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
                secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY') || 'minioadmin',
            },
        });
    }

    async uploadDocument(
        candidateId: string,
        file: any,
        type: DocumentType,
    ) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const fileExtension = file.originalname.split('.').pop();
        const key = `${candidateId}/${type}/${uuidv4()}.${fileExtension}`;

        try {
            // Upload to S3/MinIO
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }),
            );

            // Save metadata to database
            const document = await this.prisma.document.create({
                data: {
                    candidateId,
                    type,
                    status: DocumentStatus.PENDING,
                    fileUrl: key, // Store key, generate signed URL on retrieval
                    fileName: file.originalname,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                },
            });

            return document;
        } catch (error) {
            this.logger.error(`Failed to upload document for candidate ${candidateId}`, error);
            throw new BadRequestException('Failed to upload document');
        }
    }

    async getDocumentUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        // Generate signed URL valid for 1 hour
        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }

    async getCandidateDocuments(candidateId: string) {
        const documents = await this.prisma.document.findMany({
            where: { candidateId },
        });

        // Append signed URLs
        return Promise.all(
            documents.map(async (doc) => ({
                ...doc,
                signedUrl: await this.getDocumentUrl(doc.fileUrl),
            })),
        );
    }
}
