const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const app=express()

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/workspaces', require('./routes/workspace.routes'));
module.exports=app