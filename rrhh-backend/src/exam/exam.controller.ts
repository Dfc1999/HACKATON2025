import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ExamService } from './exam.service';

@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get('generate')
  async getExam(@Query('email') email: string) {
    return await this.examService.generateExam(email);
  }

  @Post('submit')
  async submitExam(@Body() body: { email: string, respuestas: any, fraude?: string }) {
    return await this.examService.submitExam(body.email, body.respuestas, body.fraude);
  }
}
