import express, { type Application, type Request, type Response } from 'express'
import { pool } from './db';
import { userRoughter } from './modules/user/user.route';
import { profileRoughter } from './modules/profile/profile.route';
import { authRoughter } from './modules/auth/auth.route';

const app : Application = express()

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}))


app.get('/', (req : Request, res: Response) => {
//   res.send('Hello World!')
    res.status(200).json({
         "message": 'Hello World!' ,
         "author": 'Rafidul'

        })
})

app.use('/api/users', userRoughter);
app.use('/api/profiles', profileRoughter );
app.use('/api/auth', authRoughter);


export default app;
