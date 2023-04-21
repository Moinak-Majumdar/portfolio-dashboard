import connectMongo from '../../src/connectMongo'
import CloudImage from '../../schema/cloudImage'
import getDb from '../../src/getDb'
import NextCors from 'nextjs-cors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
        methods: ['GET'],
        origin: '*',
        optionsSuccessStatus: 200,
    });

    await connectMongo()
    const db = await getDb()

    const apiKey = req.query.apiKey

    if (!apiKey) {
        return res.status(420).json({ badRequest: 'Api Key is missing !!' })
    }

    if (apiKey !== db) {
        return res.status(420).json({ badRequest: 'Invalid Api Key !!' })
    }

    if (req.method === 'GET') {
        try {
            const images = await CloudImage.find().sort({ projectName: 1 })
            const pn: string[] = images.map((curr) => {
                return curr.projectName
            })
            const projectNames: string[] = [... new Set(pn)]
            type dbElm = { _id: string, url: string, projectName: string, imgName: string, __v: number }
            type TDb = {
                [key: string] : dbElm[]
            }
            let db:TDb = {}
            for (const elm of images) {
                if (!db[elm.projectName]) {
                    db[elm.projectName] = []
                }
                db[elm.projectName].push(elm)
            }
            const result = [[...projectNames], {...db}]
            if (images) {
                return res.status(200).json(result)
            } else {
                return res.status(500).json({ error: 'no images to show' })
            }
        } catch (err) {
            console.log(err)
            return res.status(400).json({ error: err })
        }
    } else {
        return res.status(400).json({ error: "Invalid requested method" })
    }

}