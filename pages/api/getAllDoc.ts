import connectMongo from '../../src/connectMongo'
import Projects from '../../schema/project'
import getDb from '../../src/getDb'
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
    await NextCors(req, res, {
        methods: ['GET'],
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

    if (req.method === 'GET') {
        const type = req.query.type;

        if(type === 'work' || type === 'project') {
            try{
                const projects = await Projects.find({type: type})
        
                if(projects) {
                    return res.status(200).json(projects)
                } else {
                    return res.status(404).json({error:'no projects to show'})
                }
            } catch(err) {
                return res.status(400).json({error: err})
            }   
        } else {
            try{
                const projects = await Projects.find()
        
                if(projects) {
                    return res.status(200).json(projects)
                } else {
                    return res.status(404).json({error:'no projects to show'})
                }
            } catch(err) {
                return res.status(400).json({error: err})
            }   
        }
    } else {
        return res.status(400).json({error : "Invalid requested method"})
    }

}