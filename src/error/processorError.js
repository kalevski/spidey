class ProcessorError extends Error {
    
    ignorable = false;
    type = 'PROCESSOR_ERROR';
    
    constructor(ignorable, errorMessage, stack = null) {
        super(errorMessage);
        this.ignorable = ignorable;
        if (stack !== null) {
            this.stack = stack;
        }
    }
}

export default ProcessorError;