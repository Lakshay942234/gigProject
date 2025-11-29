import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Param,
  ParseEnumPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import 'multer';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, DocumentType } from '@prisma/client';
import { CandidatesService } from '../candidates/candidates.service';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly candidatesService: CandidatesService,
  ) {}

  @Post('upload')
  @Roles(Role.CANDIDATE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: any,
    @Body('type', new ParseEnumPipe(DocumentType)) type: DocumentType,
  ) {
    const candidate = await this.candidatesService.findByUserId(userId);
    if (!candidate) {
      throw new Error('Candidate profile not found');
    }

    return this.documentsService.uploadDocument(candidate.id, file, type);
  }

  @Get('my-documents')
  @Roles(Role.CANDIDATE)
  async getMyDocuments(@CurrentUser('id') userId: string) {
    const candidate = await this.candidatesService.findByUserId(userId);
    if (!candidate) {
      throw new Error('Candidate profile not found');
    }

    return this.documentsService.getCandidateDocuments(candidate.id);
  }
}
