
// import { NextResponse } from 'next/server'

// export const config = {
//     matcher: ["/dashboard/:path*"]
// }

// export default withAuth(
//     async function middleware(req) {
//         const url = req.nextUrl.pathname;
//         console.log(url);
//         return
//         const userRoles = req?.nextauth?.token?.user?.role


//         if (
//             url?.includes("/admin") &&
//             (!userRoles || !userRoles.includes("admin"))
//         ) {
//             return NextResponse.redirect(new URL("/", req.url));
//         }

//         if (
//             url?.includes("/author") &&
//             (!userRoles || !userRoles.includes("author"))
//         ) {
//             return NextResponse.redirect(new URL("/", req.url));
//         }

//     }, {
//     callbacks: {
//         authorized: ({ token }) => {
//             if (!token) return false
//             return true;
//         }
//     }
// }
// )

import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
    const url = request.nextUrl.pathname;

    const userData = request.cookies.get('UserData');


    if(userData) {
        const data = JSON.parse(userData.value)
        const userRoles = data.role.role_name
        
        if (url?.includes("/admin") && (!userRoles.includes("admin"))) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (url?.includes("/dashboard") && (!userRoles.includes("user"))) {
            return NextResponse.redirect(new URL("/", request.url));
        } 
    } else {
        return NextResponse.redirect(new URL("/", request.url));
    }
    

    // if(window.localStorage.getItem('token') ){
    //     console.log('sss')
    // }
    // console.log(token)
    // console.log(url)
    // console.log(request.url)
 // return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: '/dashboard/:path*',
    matcher: '/admin/:path*',
}