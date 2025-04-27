import db from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const {name , email , password} = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json({
                message: "Missing required fields",
            }, { status: 400 });
        }
        const existingUser = await db.user.findUnique({
            where: {
                email: email,
            },
        })
        if(existingUser) {
            return NextResponse.json({
                message: "User already exists",
            }, { status: 400 });
        }
        const hashedpassword = await bcrypt.hash(password, 12);

        const user = await db.user.create({
            data: {
                name: name,
                email: email,
                password: hashedpassword,
            }
        })
        return NextResponse.json({
            message: "User created",
            id : user.id,
            name : user.name,
            email : user.email,
        }, { status: 201 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong",
        }, { status: 500 });
    }
}

