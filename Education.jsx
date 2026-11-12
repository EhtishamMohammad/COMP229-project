import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";


function Education() {
    const { user, token } = useAuth();

    const isAdmin = user?.role === 'admin'; // Check if the user is authenticated and has the role of 'admin'

    const [qualifications, setQualifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        completionDate: '',
        description: ''
    });

    async function fetchQualifications() {
        try {
            const response = await fetch('http://localhost:5000/api/qualifications');
            if (!response.ok) {
                throw new Error('Failed to fetch qualifications');
            }

            const data = await response.json();
            setQualifications(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQualifications();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
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
            ? 'http://localhost:5000/api/qualifications/' + editingId
            : 'http://localhost:5000/api/qualifications';

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the user's token in the Authorization header for authentication
                },
                body: JSON.stringify(formData)
            }); 

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to save qualification');  
            };

            setSuccess(editingId 
                ? 'Qualification updated successfully' 
                : 'Qualification added successfully'
            );

            setFormData({
                title: '',
                completionDate: '',
                description: ''
            });

            setEditingId(null);

            await fetchQualifications(); // Refresh the list of qualifications after adding or updating
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(qualification) {
        setEditingId(qualification._id);

        setFormData({
            title: qualification.title,
            completionDate: qualification.completionDate,
            description: qualification.description
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

    async function handleDelete(qualificationId) {
        if (!window.confirm(
            'Are you sure you want to delete this qualification?'
        )) {
            return; 
        }

        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/qualifications/' + qualificationId, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Include the user's token in the Authorization header for authentication
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to delete qualification');
            }

            setSuccess('Qualification deleted successfully');

            if (editingId === qualificationId) {
                handleCancel(); // If the deleted qualification was being edited, reset the form
            }

            await fetchQualifications(); // Refresh the list of qualifications after deletion   
        } catch (error) {
            setError(error.message);
        } 
    }

    return (
        <div>
            <h1>Education & Qualifications</h1>

            {loading && <p>Loading Qualifications...</p>}

            {error && <p>Error: {error}</p>}

            {success && <p>{success}</p>}

            {isAdmin && (
                <div>
                    <h2>
                        {editingId
                        ? 'Edit Qualification'
                        : 'Add New Qualification'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Qualifications Table: </label>
                            <input 
                            type='text'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            required>
                            </input>
                        </div>
                        
                        <div>
                            <label>Completion Date: </label>
                            <input 
                            type='date'
                            name='completionDate'
                            value={formData.completionDate}
                            onChange={handleChange}
                            required>
                            </input>
                        </div>

                        <div>
                            <label>Description: </label>
                            <textarea 
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            required>
                            </textarea>
                        </div>

                        <button type='submit' disabled={saving}>
                            {saving
                            ? 'Saving...'
                            : editingId
                            ? 'Update Qualification'
                            : 'Add Qualification'}
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

            <h2>Qualifications List</h2>

            {!loading && !error && qualifications.length === 0 && (
                <p>No Qualifications found.</p>
            )}

            {qualifications.map((qualification) => (
                <div key={qualification._id}>
                    <h3>{qualification.title}</h3>

                    <p>{qualification.description}</p>

                    <p>
                        Completion Date: {qualification.completionDate}
                    </p>

                    {isAdmin && (
                        <div>
                            <button 
                                onClick={() => handleEdit(qualification)}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(qualification._id)}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Education; {/*exports the Education component */}