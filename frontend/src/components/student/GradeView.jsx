// components/student/GradeView.jsx
export default function GradeView({ grades }) {
    return (
      <div>
        <h2>Your Grades</h2>
        <ul>
          {grades.map((g) => (
            <li key={g.assignment}>{g.assignment}: {g.grade}</li>
          ))}
        </ul>
      </div>
    );
  }
  