import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const bookController = {
    create: async ( { body }: { 
        body: { 
        name: string; 
        price: number 
    }
    } ) => { 
        // INSERT INTO books (name, price) VALUES (?, ?)
        await prisma.book.create({
            data: body
        })
        return { message: "Book created successfully" }
    },
    list: async () => {
        // SELECT * FROM books
        return await prisma.book.findMany();
    },
    update: async ({ params, body }: {
        // UPDATE books SET name = ?, price = ? WHERE id = ?
        params: {
            id: string
        },
        body: {
            name: string;
            price: number
        }
    }) => {
        await prisma.book.update({
            where: {
                id: params.id
            },
            data: body
        })
        return { message: "Book updated successfully" }
    },
    remove: async ({ params }: {
        // DELETE FROM books WHERE id = ?
        params: {
            id: string
        }
    }) => {
        await prisma.book.delete({
            where: {
                id: params.id
            }
        })
        return { message: "Book deleted successfully" }
    },
}