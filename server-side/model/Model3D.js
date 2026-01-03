import mongoose from "mongoose";

const model3DSchema = new mongoose.Schema({
  inputImage:{
    url:String,
    publicId:String,
  },

  outputModel:{
    url:String,
    publicId:String,
  },

  status:{
    type:String,
    enum:["processing","completed","failed"],
    default:"processing",
  },

  error:String,
},
 {timestamps:true}
);

export default mongoose.model("Model3D",model3DSchema);