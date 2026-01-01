import { Routes, Route, Navigate, useLocation, replace } from "react-router-dom";
import ImageUploadPage from "./src/pages/upload";
import Viewer from "./src/pages/Viewer";

function App() {

  return (
    <Routes>
      <Route path="/" element={<ImageUploadPage/>} />
      <Route path="/view/:id" element={<Viewer/>} />
    </Routes>
  )
}

export default App
