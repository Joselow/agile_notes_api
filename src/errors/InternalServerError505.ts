import { BaseError } from "./BaseError.js";

export class InternalServerError505 extends BaseError {
    constructor(message: string = 'Internal Server Error') {
        super(message, 500);
    }
}