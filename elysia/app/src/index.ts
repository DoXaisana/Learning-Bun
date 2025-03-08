/**
 * Main application file for the Elysia API server
 * This file sets up an API server with various endpoints for user management,
 * file operations, and authentication using JWT
 */

import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";

import { bookController } from "./controller/BookController";

const app = new Elysia()
  // Configure static file serving for uploads
  .use(staticPlugin({
    assets: './uploads',
    prefix: '/uploads',
  }))
  // Configure JWT middleware for authentication
  .use(jwt({
    name: 'jwt',
    secret: "9hewhf92j3rq09ujdsffsdu21dsfudsf"
  }))

  // Basic Routes
  .get("/", () => "Hello Elysia Firmware Haahaha")
  .get("/hello", () => {
    return {
      message: "Hello Elysia Firmware",
    };
  })

  // Book Routes
  .post('/book/create', bookController.create)
  .get('/book/list', bookController.list)
  .put('/book/update/:id', bookController.update)
  .delete('/book/remove/:id', bookController.remove)

  // Dynamic Routes with Parameters
  .get('/hello/:name', ({ params }: { 
    params: {
      name: string,
    }
   }) => {
    const name = params.name;
    return {
      message: `Hello ${name}`,
    };
  })
  .get('/hello/:name/:age', ({ params}: { 
    params: {
      name: string, 
      age: number 
    } 
  }) => {
    const name = params.name;
    const age = params.age;
    return {
      message: `Hello ${name}, you are ${age} years old`,
    };
  })

  // Customer Management Routes
  .get('/customer/:id', ({ params}: {
    params: {
      id: number,
    }
  }) => {
    // Mock customer data - in real app, this would come from a database
    const customers = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 25 },
      { id: 3, name: 'Alice', age: 35 },
    ]

    const customer = customers.find((customer) => customer.id === Number(params.id));

    if (!customer) return { error: 'Customer not found' };
    
    return customer;
  })
  // Query string example route
  .get('/customer/query', ({ query }) => {
    const name = query.name;
    const age = query.age;

    return {message: `Hello ${name}, you are ${age} years old`};
  })
  // Customer CRUD Operations
  .post('/customer/create', ({ body }: {
    body: {
      name: string,
      age: number,
    }
  }) => {
      const name = body.name;
      const age = body.age;

      return { message: `Hello ${name}, you are ${age} years old` };
  })
  .put('/customer/update/:id', ({ params, body }: {
    params: {
      id: number, 
    },
    body: {
      name: string,
      age: number,
    }
  }) => {
      const id = params.id;
      const name = body.name;
      const age = body.age;
      return { message: `Hello ${id}: Your name is ${name} and you are ${age} years old` };
  })
  .delete('/customer/remove/:id', ({ params }: {
    params: {
      id: number,
    }
  }) => {
    const id = params.id;
    return { message: `Deleted Customer ID: ${id}`}
  })

  // Authentication Routes
  .post('/user/signin', async ({ jwt, set, body }: {
    jwt: any,
    set: any,
    body: {
      username: string,
      password: string,
    }
  }) => {
    try{
    // Simple authentication - in production, use proper password hashing
    const { username, password } = body;
    if (username !== 'admin' || password !== 'admin') {
      set.status = 401; // Unauthorized
      return { error: 'Invalid username or password' };
    }

    const token = await jwt.sign({ username }, {
      expiresIn: '1d',
    });
    return { token };} catch {
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  })

  // Protected Routes - require authentication
  .get('/user/profile', async ({ jwt, cookie: { auth }}:{
    jwt: any,
    cookie: any
  }) => {
    // Get user profile using JWT from cookie
    const { username } = await jwt.verify(auth.value);
    return { message : `Hello ${username}` };
  })
  .get('/user/profileFromToken', async ({ jwt, request }: {
    jwt: any,
    request: Request,
  }) => {
    // Get user profile using JWT from Authorization header
    const auth = request.headers.get('Authorization');
    const token = auth?.split(' ')[1];
    const { username } = await jwt.verify(token);
    return { message: `Hello ${username}` };
  })

  // File Operations Routes
  .post('/upload-file', ({ body }: {
    body: {
      file: File,
    }
  }) => {
    // Handle file upload using Bun's built-in file operations
    const file = body.file;
    Bun.write('uploads/' + file.name , file)
    
    return { message: 'File uploaded successfully' };
  })
  .get('/write-file', () => {
    // Example of writing a file using Bun
    Bun.write('uploads/test.txt', 'Hello World');
    return { message: 'File written successfully' };
  })
  .get('/read-file', () => {
    // Example of reading a file using Bun
    const file = Bun.file('uploads/test.txt');
    return file.text();
  })
  .listen(3000);

// Server startup message
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
