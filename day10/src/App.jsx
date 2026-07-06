import { useParams, useNavigate } from "react-router-dom";
import StudentInfo from "../data/StudentInfo";

function StudDynamicInfo() {
  // Read URL parameter (id)
  const { id } = useParams();

  // For navigation
  const navigate = useNavigate();

  // Find the matching student
  const stud = StudentInfo.find(
    (stu) => stu.id === Number(id)
  );

  return (
    <div>
      <h3>Student Info</h3>

      <h4>Id: {stud.id}</h4>
      <h4>Name: {stud.name}</h4>
      <h4>Department: {stud.dept}</h4>

      <button onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
}

export default StudDynamicInfo;