import express, { Application, Request, Response } from "express";


const app: Application = express()



app.get("/", (req: Request, res: Response) => {
    res.status(200).json("Welcome to Tour Management Backend")
})




export default app