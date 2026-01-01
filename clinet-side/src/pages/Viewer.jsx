import { useEffect, useState } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { useParams } from "react-router-dom";

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2}/>;
}

export default function Viewer() {
  const { id } = useParams();
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function fetchModel(){
      const res = await axios.get(`http://localhost:5025/api/model/${id}`);
      setModel(res.data.modelUrl);
    }
    fetchModel();
  }, []);

  return (
    <div style={{height:"100vh"}}>
      {model ? (
        <Canvas camera={{ position:[0,1,3] }}>
          <ambientLight intensity={1}/>
          <Environment preset="studio"/>
          <Model url={model}/>
          <OrbitControls/>
        </Canvas>
      ) : <h2 style={{textAlign:"center"}}>⏳ Generating 3D Model...</h2>}
    </div>
  );
}
