const mongoose=require('mongoose')
const boardSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            require:[true,'Board name is required'],
            trim:true,
        },
        workspace:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Workspace',
            required:true,
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true 
        }
    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model('Board', boardSchema);