import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import StudentDetail from "./pages/StudentDetail";

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav>
          {/* Home Link */}
          <NavLink to="/">Home</NavLink>
          {" | "}
          <NavLink to="/students">StudentsDetail</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentDetail />} />
          <Route path="/students/:id" element={<StudentDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;