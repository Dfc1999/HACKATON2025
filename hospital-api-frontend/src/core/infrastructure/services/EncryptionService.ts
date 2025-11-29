import CryptoJS from 'crypto-js';

// Aseguramos que randomValues no sea undefined antes de usarlo
// y añadimos un fallback seguro para evitar el error ts(2532)

export class EncryptionService {
  private readonly ENCRYPTION_KEY: string;
  private readonly IV_LENGTH = 16;

  constructor(encryptionKey?: string) {
    this.ENCRYPTION_KEY = encryptionKey || this.generateSecureKey();
  }

  encryptFaceVector(faceVector: Float32Array): string {
    try {
      const vectorArray = Array.from(faceVector);
      const vectorString = JSON.stringify(vectorArray);
      
      const encrypted = CryptoJS.AES.encrypt(
        vectorString,
        this.ENCRYPTION_KEY
      ).toString();

      return encrypted;

    } catch (error) {
      console.error('Error encrypting face vector:', error);
      throw new Error('Failed to encrypt face vector');
    }
  }

  decryptFaceVector(encryptedVector: string): Float32Array {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedVector,
        this.ENCRYPTION_KEY
      );

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      const vectorArray = JSON.parse(decryptedString);

      return new Float32Array(vectorArray);

    } catch (error) {
      console.error('Error decrypting face vector:', error);
      throw new Error('Failed to decrypt face vector');
    }
  }

  hashSensitiveData(data: string): string {
    try {
      return CryptoJS.SHA256(data).toString();
    } catch (error) {
      console.error('Error hashing data:', error);
      throw new Error('Failed to hash sensitive data');
    }
  }

  encryptData(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        data,
        this.ENCRYPTION_KEY
      ).toString();

      return encrypted;

    } catch (error) {
      console.error('Error encrypting data:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decryptData(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedData,
        this.ENCRYPTION_KEY
      );

      return decrypted.toString(CryptoJS.enc.Utf8);

    } catch (error) {
      console.error('Error decrypting data:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  generateSecureToken(length: number = 32): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      if (randomValues && randomValues[i] !== undefined) {
        token += characters.charAt((randomValues?.[i] ?? Math.floor(Math.random() * characters.length)) % characters.length);
      } else {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    }
    
    return token;
  }

  hashPassword(password: string, salt?: string): string {
    const saltToUse = salt || this.generateSecureToken(16);
    const hash = CryptoJS.PBKDF2(password, saltToUse, {
      keySize: 256 / 32,
      iterations: 10000
    }).toString();

    return `${saltToUse}:${hash}`;
  }

  verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      const [salt, hash] = hashedPassword.split(':');
      const newHash = CryptoJS.PBKDF2(password, salt ?? '', {
        keySize: 256 / 32,
        iterations: 10000
      }).toString();

      return hash === newHash;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  encryptObject<T>(obj: T): string {
    const jsonString = JSON.stringify(obj);
    return this.encryptData(jsonString);
  }

  decryptObject<T>(encryptedObj: string): T {
    const jsonString = this.decryptData(encryptedObj);
    return JSON.parse(jsonString) as T;
  }

  private generateSecureKey(): string {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }

  generateHMAC(data: string, secret: string): string {
    return CryptoJS.HmacSHA256(data, secret).toString();
  }

  verifyHMAC(data: string, hmac: string, secret: string): boolean {
    const computedHmac = this.generateHMAC(data, secret);
    return computedHmac === hmac;
  }
}