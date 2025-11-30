import { Controller, Post, Body } from '@nestjs/common';
import { ProctoringService } from './proctoring.service';

@Controller('proctoring')
export class ProctoringController {
  constructor(private readonly proctoringService: ProctoringService) {}

  @Post('analyze')
  async analyze(@Body() body: { image: string }) {
    return await this.proctoringService.analyzeFrame(body.image);
  }
}
