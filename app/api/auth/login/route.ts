import db from "@/app/lib/prismadb";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
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

       const cookieStore = await cookies();
       cookieStore.set('session_token' , user.id , {
        httpOnly:true,
        secure : process.env.NODE_ENV === 'production',
        sameSite : 'lax',
        maxAge : 60 * 60 * 24 * 7,
        path : '/,'
       })
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