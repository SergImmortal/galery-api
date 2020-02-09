import express from "express";
import cookieParser from 'cookie-parser';
import authMDW from '../lib/middleware/auth';
import adminRourer from './admin';
import indexRouter from './index';
import userRouter from './user';

const router = (app: express.Express) => {

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use('/', indexRouter);
    app.use('/user', userRouter);
    app.use('/admin', authMDW, adminRourer)
};

export default router;