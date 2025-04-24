import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const url = request.nextUrl.pathname;
    const userData = request.cookies.get('UserData');

    if(userData) {
        const data = JSON.parse(userData.value)
        const userRoles = data.role.id
        
        if (url?.includes("/admin") && userRoles < 2) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (url?.includes("/home") && userRoles !== 1) {
            return NextResponse.redirect(new URL("/", request.url));
        } 
    }
    else {
        return NextResponse.redirect(new URL("/", request.url));
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/home/:path*', '/admin/:path*'],
};