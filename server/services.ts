import {Request, Response } from 'express';

import * as adminModel from './queries.ts';

export const getCategories = async(req: Request, res:Response):Promise<void>=>{
    try{
        const data = await adminModel.getCategories();
        res.status(200).send(data);
    }
    catch(err){
        console.log(err);
        res.status(500).send('Failed to fetch categories');
    }
};
