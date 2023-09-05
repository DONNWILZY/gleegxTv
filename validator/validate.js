const { validationResult } = require("express-validator");

// Middleware to run validation and handle errors
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Extract error messages from validation results
        let errorsList = errors.array().map((error) => error.msg);
        
        // Respond with a 400 status code and the error messages
        return res.status(400).json({ errors: errorsList });
    }
    
    // No validation errors, continue with the next middleware
    next();
};

module.exports = runValidation;
