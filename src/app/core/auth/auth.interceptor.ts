import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    console.log("dentro interceptor");
    const token = sessionStorage.getItem('access_token');
    if (token && !req.headers.has('Authorization')) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }


    return next(req);
};