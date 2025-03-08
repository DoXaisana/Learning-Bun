import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

const app = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: "9hewhf92j3rq09ujdsffsdu21dsfudsf"
  }))
  .get("/", () => "Hello Elysia Firmware Haahaha")
  .get("/hello", () => {
    return {
      message: "Hello Elysia Firmware",
    };
  } )
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
  .get('/customer/:id', ({ params}: {
    params: {
      id: number,
    }
  }) => {
    const customers = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 25 },
      { id: 3, name: 'Alice', age: 35 },
    ]

    const customer = customers.find((customer) => customer.id === Number(params.id));

    if (!customer) return { error: 'Customer not found' };
    
    return customer;
  })
  .get('/customer/query', ({ query }) => {
    const name = query.name;
    const age = query.age;

    return {message: `Hello ${name}, you are ${age} years old`};
  })
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
  .post('/user/signin', async ({ jwt, set, body }: {
    jwt: any,
    set: any,
    body: {
      username: string,
      password: string,
    }
  }) => {
    try{
    
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
  .get('/user/profile', async ({ jwt, cookie: { auth }}:{
    jwt: any,
    cookie: any
  }) => {
    const { username } = await jwt.verify(auth.value);
    return { message : `Hello ${username}` };
  })
  .get('/user/profileFromToken', async ({ jwt, request }: {
    jwt: any,
    request: Request,
  }) => {
    const auth = request.headers.get('Authorization');
    const token = auth?.split(' ')[1];
    const { username } = await jwt.verify(token);
    return { message: `Hello ${username}` };
  })
  .post('/upload-file', ({ body }: {
    body: {
      file: File,
    }
  }) => {
    const file = body.file;
    Bun.write('uploads/' + file.name , file)
    
    return { message: 'File uploaded successfully' };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
