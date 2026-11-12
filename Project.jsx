import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';


function Projects() {
    const { user, token } = useAuth();

    const isAdmin = user?.role === 'admin';
    
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(''); 
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        completionDate: '',
        description: '' 
    })

    async function fetchProjects() {
        try {
            const response = await fetch('http://localhost:5000/api/projects')

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((formData) => ({
            ...formData,
            [name]: value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        
        try {
            const url = editingId 
            ? `http://localhost:5000/api/projects/${editingId}`
            : 'http://localhost:5000/api/projects';

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            }); 
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save project');
            }

            setSuccess(editingId ? 'Project updated successfully' : 'Project created successfully');

            setFormData({
                title: '',
                completionDate: '',
                description: ''
            });

            setEditingId(null);

            await fetchProjects();
        }   catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(project) {
        setEditingId(project._id);
        setFormData({
            title: project.title,
            completionDate: project.completionDate,
            description: project.description
        });

        setError('');
        setSuccess('');
    }

    function handleCancel() {
        setEditingId(null);
        setFormData({
            title: '',
            completionDate: '',
            description: ''
        });
        setError('');
        setSuccess('');
    }

    async function handleDelete(projectId) {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/projects/' + projectId,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                }      
            }
        );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete project');
            }

            setSuccess('Project deleted successfully');

            if (editingId === projectId) {
                handleCancel();
            }

            await fetchProjects();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h1>Projects</h1>

            {loading && <p>Loading projects...</p>}

            {error && <p>Error: {error}</p>}

            {success && <p>{success}</p>}

            {isAdmin && (
                <div>
                    <h2>
                        {editingId ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Project Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Completion Date:</label>
                            <input
                                type="date"
                                name="completionDate"
                                value={formData.completionDate}
                                onChange={handleChange}
                                required
                            />  
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type='submit' disabled={saving}>
                            {saving
                                ? 'Saving...'
                                : editingId
                                ? 'Update Project'
                                : 'Add Project'}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </div>
            )}

            <h2>Project List</h2>
            {!loading && !error && projects.length === 0 && (<p>No projects found.</p>)}

            {projects.map((project) => (
                <div key={project._id}>
                    <h3>{project.title}</h3>

                    <p>{project.description}</p> 
                    
                    <p>Completion Date: {project.completionDate}</p>

                    {isAdmin && (
                        <div>
                            <button onClick={() => handleEdit(project)}>Edit</button>
                            <button onClick={() => handleDelete(project._id)}>Delete</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Projects;  
