import NextCors from 'nextjs-cors'
import connectMongo from '../../src/connectMongo'
import Projects from '../../schema/project'
import getDb from '../../src/getDb'
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const { name, type, status, role, intro, liveUrl, gitRepo, slug, description, img, tools, toolsLogo } = req.body;

        
        if(!name || !type || !status || !role || !intro || !liveUrl || !gitRepo || !slug || !description || !img || !tools || !toolsLogo) {
            return res.status(422).json({error: "all fields are required"})
        }

        try {
            const exist = await Projects.findOne({name: name})
        
            if(exist) {
                return res.status(500).json({error: "project already exist"})
            }

            const data = new Projects({ name, type, status, role, intro, liveUrl, gitRepo, slug, description, img, tools, toolsLogo })
            const newProject = await data.save()

            if(newProject) {
                return res.status(200).json({success: 'project added successfully'})
            } else {
                return res.status(400).json({error: 'failed to add at mongo'})
            }
        }   
        catch(err) {
            return res.status(400).json({error: err})
        }    
    } else {
        return res.status(400).json({error : "Invalid requested method"})
    }

}