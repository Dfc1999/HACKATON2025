import Tesseract from 'tesseract.js';

export interface LicenseValidationResult {
  isValid: boolean;
  extractedNumber?: string;
  confidence: number;
  documentQuality: number;
}

export class OCRService {
  private readonly LICENSE_NUMBER_PATTERNS = [
    /(?:MP|RN|ME|MED)[\s-]?\d{4,8}/gi,
    /\b\d{6,10}\b/g,
    /[A-Z]{2,4}[\s-]?\d{4,8}/gi
  ];

  async extractTextFromDocument(imageFile: File): Promise<string> {
    try {
      const result = await Tesseract.recognize(imageFile, 'spa+eng', {
        logger: () => {}
      });

      return result.data.text;

    } catch (error) {
      console.error('Error extracting text from document:', error);
      throw new Error('Failed to extract text from document');
    }
  }

  async validateProfessionalLicense(
    extractedText: string,
    expectedLicenseNumber: string
  ): Promise<LicenseValidationResult> {
    try {
      const normalizedExtracted = this.normalizeText(extractedText);
      const normalizedExpected = this.normalizeText(expectedLicenseNumber);

      const foundNumbers = this.extractLicenseNumbers(normalizedExtracted);

      const exactMatch = foundNumbers.some(num => 
        this.normalizeText(num) === normalizedExpected
      );

      if (exactMatch) {
        return {
          isValid: true,
          extractedNumber: expectedLicenseNumber,
          confidence: 1.0,
          documentQuality: 1.0
        };
      }

      const partialMatch = foundNumbers.find(num => {
        const normalized = this.normalizeText(num);
        return normalized.includes(normalizedExpected) || 
               normalizedExpected.includes(normalized);
      });

      if (partialMatch) {
        const similarity = this.calculateStringSimilarity(
          this.normalizeText(partialMatch),
          normalizedExpected
        );

        return {
          isValid: similarity > 0.8,
          extractedNumber: partialMatch,
          confidence: similarity,
          documentQuality: 0.85
        };
      }

      return {
        isValid: false,
        confidence: 0,
        documentQuality: this.assessDocumentQuality(normalizedExtracted)
      };

    } catch (error) {
      console.error('Error validating professional license:', error);
      return {
        isValid: false,
        confidence: 0,
        documentQuality: 0
      };
    }
  }

  async extractStructuredData(imageFile: File): Promise<Record<string, string>> {
    try {
      const text = await this.extractTextFromDocument(imageFile);
      
      const data: Record<string, string> = {};

      const nameMatch = text.match(/(?:nombre|name)[:\s]+([A-Za-zÁ-ú\s]+)/i) ?? null;
      if (nameMatch && nameMatch[1]) {
        data.name = nameMatch[1].trim();
      }

      const licenseMatch = text.match(/(?:matrícula|license|MP|RN)[:\s#]*(\d+)/i) ?? null;
      if (licenseMatch && licenseMatch[1]) {
        data.licenseNumber = licenseMatch[1].trim();
      }

      const specialtyMatch = text.match(/(?:especialidad|specialty)[:\s]+([A-Za-zÁ-ú\s]+)/i) ?? null;
      if (specialtyMatch && specialtyMatch[1]) {
        data.specialty = specialtyMatch[1].trim();
      }

      const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/) ?? null;
      if (dateMatch && dateMatch[0]) {
        data.date = dateMatch[0];
      }

      return data;

    } catch (error) {
      console.error('Error extracting structured data:', error);
      return {};
    }
  }

  private extractLicenseNumbers(text: string): string[] {
    const foundNumbers: string[] = [];

    this.LICENSE_NUMBER_PATTERNS.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        foundNumbers.push(...matches);
      }
    });

    return [...new Set(foundNumbers)];
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = Array.from({ length: str2.length + 1 }, () =>
      Array(str1.length + 1).fill(0)
    );

    // Inicializar primera columna
    for (let i = 0; i <= str2.length; i++) {
      matrix[i]![0] = i;
    }

    // Inicializar primera fila
    for (let j = 0; j <= str1.length; j++) {
      matrix[0]![j] = j;
    }

    // Calcular distancia de edición
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        const cost = str2.charAt(i - 1) === str1.charAt(j - 1) ? 0 : 1;
        const deletion = matrix[i - 1]![j]!;
        const insertion = matrix[i]![j - 1]!;
        const substitution = matrix[i - 1]![j - 1]!;

        matrix[i]![j]! = Math.min(deletion + 1, insertion + 1, substitution + cost);
      }
    }

    return matrix[str2.length]![str1.length]!;
  }

  private assessDocumentQuality(text: string): number {
    let quality = 0.5;

    if (text.length > 100) quality += 0.2;
    if (text.length > 300) quality += 0.1;

    const hasNumbers = /\d/.test(text);
    const hasLetters = /[a-zA-Z]/.test(text);
    if (hasNumbers && hasLetters) quality += 0.2;

    return Math.min(quality, 1.0);
  }
}