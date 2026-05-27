// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};

module.exports = errorHandler;

// The errorHandler middleware is designed to catch and handle any errors that occur during the request-response cycle in an Express application. Here's a detailed explanation of what it does, what types of errors it targets, and why it is kept at the end of the middleware stack:
/*Logs the Error:

console.error('Error:', err.stack); logs the error stack trace to the console. This includes detailed information about where and why the error occurred, which is useful for debugging.
Sends an Error Response:

res.status(500).json({ success: false, message: 'Internal Server Error' }); sends a JSON response with a 500 status code (indicating an internal server error). This response informs the client that something went wrong on the server side without exposing sensitive details.
Types of Errors It Targets
The errorHandler middleware targets any errors that occur within the request-response cycle, including but not limited to:

Syntactical Errors:

Errors in your code, such as syntax errors or runtime errors, that may cause your application to throw an exception.
Operational Errors:

Errors that occur during the operation of the application, such as database connection failures, file read/write errors, or issues with external API calls.
Route Handling Errors:

Errors that occur within your route handlers. For example, trying to access a property of undefined or other runtime exceptions.
Middleware Errors:

Errors that occur within other middleware functions. This can include validation errors, authentication/authorization failures, etc.
Why It Is Kept at the End
The error handling middleware is kept at the end of the middleware stack for the following reasons:

Catch-All Mechanism:

The error handling middleware acts as a catch-all for any errors that occur in the previous middleware or route handlers. By placing it at the end, you ensure it can capture errors from all parts of the application.
Middleware Execution Order:

Express executes middleware in the order they are defined. If the error handler were placed at the top, it would execute before any routes or other middleware, making it ineffective at catching errors from those parts.
Consistency and Control:

Keeping the error handler at the end ensures a consistent way to handle errors, allowing you to control the format and content of error responses. This improves the client-side handling of errors and enhances the user experience by providing meaningful error messages.
Example Flow
Here's an example of how the error handler works in practice:

A request is made to your application.
Middleware for parsing JSON, handling cookies, CORS, etc., is executed.
The request reaches a route handler. Suppose there's an error in the route handler, like accessing a property of undefined.
The error is thrown and propagated back up the middleware stack.
The error handler catches the error, logs it, and sends a 500 status code response to the client.
*/
