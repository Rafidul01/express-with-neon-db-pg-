import express, { type Application, type Request, type Response } from 'express'
import { Pool } from 'pg'

const app : Application = express()
const port = 3000

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}))

const pool = new Pool({
    connectionString:"postgresql://.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
});

const initDB = async ()=>{
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20) NOT NULL,
            email VARCHAR(20) NOT NULL UNIQUE,
            password VARCHAR(20) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            age INT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("DB Connected successfully")

    }catch(err){
        console.log(err)
    }
};
initDB();

app.get('/', (req : Request, res: Response) => {
//   res.send('Hello World!')
    res.status(200).json({
         "message": 'Hello World!' ,
         "author": 'Rafidul'

        })
})

app.post('/',async(req : Request, res: Response) => {
    // console.log(req.body)
    const {name, email, password}= req.body;
    res.status(200).json({
        "message": ' World!' ,
        "body" : {
            name,
            email,
        },
       
       })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
