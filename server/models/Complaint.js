import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  city:{
    type:String,
    required:true
  },

  state:{
    type:String,
    required:true
  },

  address:{
    type:String,
    required:true
  },

  description:{
    type:String,
    required:true
  },

  category:{
    type:String,
    default:"General"
  },

  image: {
  type: String,
  },
  
  priority:{
    type:String,
    default:"Low"
  },
  location:{
  lat:Number,
  lng:Number
},

  status:{
    type:String,
    default:"New"
  },

  imageUrl:String

},{timestamps:true})

const Complaint = mongoose.model("Complaint",complaintSchema)

export default Complaint