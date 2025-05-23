// components/instructor/Gradebook.jsx
export default function Gradebook({ students, assignments }) {
    return (
      <table>
        <thead>
          <tr>
            <h2>Student</h2>
            {assignments.map((a) => <th key={a.id}>{a.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              {assignments.map((a) => (
                <td key={a.id}><input type="number" /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  