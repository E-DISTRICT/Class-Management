// components/student/AssignmentList.jsx
export default function AssignmentList({ assignments }) {
    return (
      <div>
        <h2>Assignments</h2>
        {assignments.map((a) => (
          <div key={a.id}>
            <p>{a.title}</p>
            <input type="file" />
          </div>
        ))}
      </div>
    );
  }
  