import withAuth from "./app/middlewares/withAuth";
import { NextResponse } from "next/server";

const authRoutes = ['/dashboard', '/chat']

export function mainMiddleware(){
    const res = NextResponse.next()
    return res
}

export default withAuth(mainMiddleware, authRoutes)