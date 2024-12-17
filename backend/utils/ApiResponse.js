export class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.success = {
      message,
      statusCode,
    };
    this.data = data;
  }
}
