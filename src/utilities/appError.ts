export default class AppError extends Error {
  status: string;
  
  constructor(message: string, public statusCode: number) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; 

    Error.captureStackTrace(this, this.constructor);
  }
}
