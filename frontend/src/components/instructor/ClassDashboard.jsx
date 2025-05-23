// components/instructor/ClassDashboard.jsx
export default function ClassDashboard({ classes }) {
    return (
        <div>
            <h2>Dashboard</h2>
            {classes.map((cls) => (
                <div key={cls.id}>
                    <h3>{cls.name}</h3>
                    <p>{cls.description}</p>
                </div>
            ))}
        </div>
    );
}  