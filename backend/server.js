require('dotenv').config()
const http=require('http')
const app=require('./src/app')
const connectDB=require('./src/config/db')
const server=http.createServer(app)
const PORT=process.env.PORT || 5000
const { initSocket } = require('./src/config/socket');

initSocket(server);
connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
})
