import express, { type Application, type Request, type Response } from 'express'
import { Pool } from 'pg'
import config from './config';

const app : Application = express()
const port = config.PORT

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}))

const pool = new Pool({
    connectionString: config.connection_string
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

app.post('/api/users',async(req : Request, res: Response) => {
    // console.log(req.body)
    const {name, email, password, age}= req.body;
    try{
        const result = await pool.query(`
        INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
        RETURNING *
        `, [name, email, password, age]);
    // console.log(result)
    res.status(201).json({
        "message": ' User Created Successfully!' ,
        "body" : result.rows[0],
       })

    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
})

app.get('/api/users',async(req : Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM users`);
        res.status(200).json({
            "success": true,
            "message": 'User retrieved Successfully!' ,
            "data" : result.rows,
           })

    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
})
app.get('/api/users/:id',async(req : Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await pool.query(`
            
            SELECT * FROM users WHERE id = $1
            `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                "success": false,
                "message": 'User not found!' ,
            })
        }
        res.status(200).json({
            "success": true,
            "message": 'User retrieved Successfully!' ,
            "data" : result.rows[0],
        })
    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
})

app.put('/api/users/:id',async(req : Request, res: Response) => {
    const {id} = req.params;
    const {name,password,is_active, age}= req.body;
    try{
        const result = await pool.query(`
        UPDATE users SET name = COALESCE($1, name), password = COALESCE($2, password), is_active = COALESCE($3, is_active), age = COALESCE($4, age) WHERE id = $5
        RETURNING *
        `, [name, password, is_active, age, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                "success": false,
                "message": 'User not found!' ,
            })
        }
        res.status(200).json({
            "success": true,
            "message": 'User updated Successfully!' ,
            "data" : result.rows[0],
           })
    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
})

app.delete('/api/users/:id',async(req : Request, res: Response) => {
    const {id} = req.params;
    try{
        const result = await pool.query(`
        DELETE FROM users WHERE id = $1
        RETURNING *
        `, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({
                "success": false,
                "message": 'User not found!' ,
            })
        }
        res.status(200).json({
            "success": true,
            "message": 'User deleted Successfully!' ,
            "data" : result.rows[0],
           })
    }catch(err : any){
        res.status(500).json({
        message: err.message ,
        error : err,
       });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
