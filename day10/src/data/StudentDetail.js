import StudentInfo from "../data/StudentInfo";
import { Link } from "react-router-dom";

function StudentDetail() {
  return (
    <div>
      <h2>Student Details:</h2>

      {StudentInfo.map((student) => (
        <div key={student.id}>
          <Link to={`/student/${student.id}`}>
            {student.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default StudentDetail;