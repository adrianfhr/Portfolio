# API Explorer — States

> **Module:** API Explorer  
> **Version:** 1.0

## 1. Primary States

### 1.1 Idle
- The explorer is loaded but no endpoint is being tested.

### 1.2 Editing
- Request fields are open for input.

### 1.3 Authorized
- JWT or other auth credentials are active for protected routes.

### 1.4 Executing
- A request is in flight.

### 1.5 Success
- A response was returned and rendered.

### 1.6 Error
- The request failed validation, authorization, timeout, or server execution.

## 2. Transition Notes

- Idle -> Editing when an endpoint is selected.
- Editing -> Executing when the user sends a request.
- Executing -> Success or Error when a response returns.