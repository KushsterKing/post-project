import express from 'express';

import axios from 'axios';

import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Sequelize from 'sequelize';
const Op = Sequelize.Op;

import Posts from './postModel.js';

const app = express();

app.get('/populate', async (req, res) => {

    try {

        let result  = await axios.get('https://jsonplaceholder.typicode.com/comments')

        let data = result.data;

        // console.log(data);

        let result2  = await axios.get('http://cfte.mbwebportal.com/deepak/csvdata.csv')

        fs.writeFileSync(__dirname + '/test.csv', result2.data)


        let readStream = fs.createReadStream(__dirname + '/test.csv', {encoding: 'utf-8'})

        readStream.on('data', (chunk) => {
            let mapping = {};

            chunk.split('\n').forEach((line, index) => {

                line = line.split('\r')[0];
                let arr = line.split(',');

                if(index === 0){

                    // console.log(line)
                    arr.forEach((elm, i) => {
                        mapping[elm.trim()] = i;
                    })

                    // console.log(mapping)
                } else {

                    if(arr.length === 5)
                        data.push({postId: arr[mapping.postId], id: arr[mapping.id],
                                   email: arr[mapping.email], name: arr[mapping.name],
                                   body: arr[mapping.body]})
                }
            })

        })

        readStream.on('end', async () => {
            await Posts.bulkCreate(data, { updateOnDuplicate: ["id", "name", "email", "body"] })
        })

        res.status(200).send('success');

    } catch (e){
        res.status(400).send('something went wrong');
    }
})

app.post('/search', async (req, res) => {

    try {

        let { name, email, body, limit, order, orderBy } = req.query;

        let where = {};

        if(name){
            where['name'] = name;
        }

        if(email){
            where['email'] = email;
        }

        if(body){
            where['body'] = {
                [Op.like]: `%${body}%`
            };
        }

        let finalObject = {where}

        if(limit){
            finalObject['limit'] = Number(limit);
        }

        if(order && orderBy && ['ASC', 'DESC'].includes(order.toUpperCase()) && ['id', 'name', 'email', 'postId'.includes(orderBy)]){
            finalObject['order'] = [[orderBy.toUpperCase(), order]];
        }

        let data = await Posts.findAll(finalObject)

        res.json(data)

    } catch (e) {

        console.log(e);

        res.status(400).send('something went wrong');
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})