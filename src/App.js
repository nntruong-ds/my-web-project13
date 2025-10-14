import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import QuenPass from "./components/QuenPass";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot" element={<QuenPass />} />
            </Routes>
        </Router>
    );
}

export default App;
