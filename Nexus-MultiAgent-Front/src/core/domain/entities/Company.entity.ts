export class CompanyEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly logoUrl: string,
    public readonly mission?: string,
    public readonly vision?: string,
    public readonly values?: string[],
    public readonly contactEmail?: string,
    public readonly phone?: string,
    public readonly address?: string,
    public readonly socialMedia?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    }
  ) {}
}