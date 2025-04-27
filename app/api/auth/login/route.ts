import db from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    try {
        const {email, password} = await req.json();
        if (!email ||!password) {
            return NextResponse.json({
                message: "Missing required fields",
            }, { status: 400 });
        }
       const user = await db.user.findUnique({
        where: {
            email: email,
        },
       })
       if(!user) {
        return NextResponse.json({
            message: "User not found",
        }, { status: 400 });
       }
       const isCorrectPassword = await bcrypt.compare(password, user.password);
       if(!isCorrectPassword) {
        return NextResponse.json({
            message: "Incorrect password",
        }, { status: 400 });
       }
       return NextResponse.json({
        message: "User logged in",
        id : user.id,
        name : user.name,
        email : user.email,
       })
    }
    catch(error) {
        console.log(error);
        return NextResponse.json({
            message: "Something went wrong",
        }, { status: 500 });
    }
}