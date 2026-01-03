import axios from 'axios';

export const generate3DModel = async(imageUrl)=>{
    const res = await axios.post(
        process.env.AI_SERVICE_URL,
        {image_url:imageUrl},
        {timeout:1000*60*5}
    );

    return res.data;
}