import { useEffect, useState } from 'react';
function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); 

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch('http://localhost:5000/projects');
                if (!response.ok) {
                    throw new Error('Failer to fetch projects'); 
                }
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []); 

    return (
        <div>
            <h1>Projects</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && projects.length === 0 && (
                <p>No projects found.</p>
            )}
           {projects.map((project) => 
                <div key={project._id}>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    {project.completionDate && (<p>Completion Date: {project.completionDate}</p>)}
                </div>
            )}
        </div>
    );
}

export default Projects;


/*
function Projects() {
    return (
        <div>
            <h1>Projects (purely fictional)</h1>
            <p>My following projects include...</p> 
            <p>1. PROJECT: TRIGGER: although currently in Onenote, I wish to have this as a FPS, Hack 'n' Slash, Horror game.</p>
            <p>2. Apex Hunter: a FPS game where the main goal is to adapt to enemies, with each death serving as a learning experience.</p> 
            <p>3. a racing game where the main goal is to race against other players and AI</p> 
        </div>
    );
}

export default Projects; 
*/ 