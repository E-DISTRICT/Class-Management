// components/instructor/StudentList.jsx
export default function StudentList({ students }) {
    return (
      <div>
        <h2>Enrolled Students</h2>
        <ul>
          {students.map((s) => (
            <li key={s.id}>{s.name}</li>
          ))}
        </ul>
      </div>
    );
  }  