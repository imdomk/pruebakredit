export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  detalles?: Record<string, string>;
  constructor(message: string, detalles?: Record<string, string>) {
    super(message);
    this.name = "ValidationError";
    this.detalles = detalles;
  }
}