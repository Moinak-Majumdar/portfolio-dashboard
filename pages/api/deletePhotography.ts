import connectMongo from '../../src/connectMongo'
import Photography from '../../schema/photography'
import getDb from '../../src/getDb'
import NextCors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
        methods: ['POST'],
        origin: '*',
        optionsSuccessStatus: 200, 
    });

    await connectMongo()
    const db = await getDb()

    const apiKey = req.query.apiKey

    if(!apiKey) {
        return res.status(420).json({badRequest: 'Api Key is missing !!'})
    }

    if(apiKey !== db){
        return res.status(420).json({badRequest: 'Invalid Api Key !!'})
    }

    if (req.method === 'POST') {
        const url = req.body.url;
    
        if(!url) {
            return res.status(400).json({error: 'absolute url is required'})
        }
        
        const exist = await Photography.findOne({"url": url})

        if(exist) {
            try {
                const promise = await Photography.deleteOne({"url" : url})
                if(promise) {
                    return res.status(200).json({success: "Photography deleted successfully"})
                } else {
                    return res.status(400).json({error: "Failed to delete"})
                }
            } catch (err) {
                return res.status(400).json({error: err})
            }

        } else {
            return res.status(400).json({error: "Photography not found"})
        }
    } else {
        return res.status(400).json({error : "Invalid requested method"})
    }

}