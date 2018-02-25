class DatabaseError extends Error {
    
    type = 'DATABASE_ERROR';
    
    constructor(errorMessage, stack = null) {
        super('[DATABASE]: ' + errorMessage);
        if (stack !== null) {
            this.stack = stack;
        }
    }
}

export default DatabaseError;