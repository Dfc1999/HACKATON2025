import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BlobService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const container = process.env.AZURE_CONTAINER_NAME;

    if (!connectionString || !container) {
      throw new Error('FATAL: Faltan variables de entorno de Azure Storage');
    }

    this.containerName = container;
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  async uploadFile(
    file: Express.Multer.File,
    organizationId: string,
  ): Promise<{ url: string; fileName: string }> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

      // CORRECCIÓN CRÍTICA:
      // Quitamos { access: 'blob' }. Ahora solo verifica existencia.
      // Si ya existe (tu caso), no hace nada y continúa.
      // Si no existe, lo crea con la configuración por defecto de tu cuenta.
      await containerClient.createIfNotExists();

      const extension = file.originalname.split('.').pop();
      const safeFileName = `${uuidv4()}.${extension}`;

      // Aquí creamos la "subcarpeta" virtual con el ID de la organización
      const blobPath = `${organizationId}/${safeFileName}`;

      const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobPath);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
      });

      return {
        url: blockBlobClient.url,
        fileName: safeFileName
      };
    } catch (error) {
      console.error('Error subiendo a Azure:', error);
      throw new InternalServerErrorException('Error al subir archivo al almacenamiento');
    }
  }
}
