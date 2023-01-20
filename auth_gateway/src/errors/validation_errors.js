class InvalidPasswordError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidPasswordError';
    }
}



exports.InvalidPasswordError = InvalidPasswordError;
