// components/student/MyClasses.jsx
export default function MyClasses({ classes }) {
    return (
      <div>
        <h2>My Enrolled Classes</h2>
        {classes.map((cls) => (
          <div key={cls.id}>
            <h3>{cls.name}</h3>
            <p>{cls.schedule}</p>
          </div>
        ))}
      </div>
    );
  }
  