require('dotenv').config()
const http=require('http')
const app=require('./src/app')
const connectDB=require('./src/config/db')
const server=http.createServer(app)
const PORT=process.env.PORT || 5000
connectDB().then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
})