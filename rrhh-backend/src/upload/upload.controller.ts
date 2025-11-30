import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { BlobService } from '../blob/blob.service';
import { CurrentUser } from '../auth/current-user.decorator';
// 👇 SOLUCIÓN: Agregamos "type" aquí
import type { AuthUser } from '../auth/auth-user.interface';

@Controller('documents')
@UseGuards(AccessTokenGuard)
export class UploadController {
  constructor(private readonly blobService: BlobService) {}

  @Post('upload-master')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMasterDocument(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    if (!file) throw new BadRequestException('No se envió ningún archivo');

    // LÓGICA DE CARPETAS:
    const folderId = user.organizationId || user.sub;

    console.log(`Subiendo archivo para: ${folderId}`);

    const result = await this.blobService.uploadFile(file, folderId);

    return {
      message: 'Documento maestro subido exitosamente',
      url: result.url,
      path: `${folderId}/${result.fileName}`,
      uploadedBy: user.sub
    };
  }
}
