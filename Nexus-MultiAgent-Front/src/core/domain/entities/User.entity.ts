
export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly avatar?: string,
    public readonly createdAt?: Date
  ) {}

  getInitials(): string {
    return this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getDisplayName(): string {
    return this.name || this.email.split('@')[0];
  }
}
