import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function AdminContacts() {
    const { token } = useAuth();

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState(null); 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const fetchContacts = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/contacts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error( data.message || 'Failed to fetch contacts');
            }
            setContacts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        fetchContacts();
    }, [token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEdit = (contact) => {
        setEditingId(contact._id);
        setFormData({
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            message: contact.message
        });

        setError('');
        setSuccess('');
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/contacts/' + editingId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update contact');
        }

        setEditingId(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            message: ''
        });

        setSuccess('Contact updated successfully');
        await fetchContacts(); // Refresh the list of contacts after updating
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            message: ''
        });
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) {
            return;
        }

        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/contacts/' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete contact');
            }

            setSuccess('Contact deleted successfully');
            await fetchContacts(); // Refresh the list of contacts after deleting
        } catch (error) {
            setError(error.message);
        } 
    };

    return (
        <div className="admin-contacts-page">
            <h1>Administrative Contacts</h1>

            {loading && <p>Loading contacts...</p>}

            {error && <p role="alert">{error}</p>}
            
            {success && <p role="status">{success}</p>}

            {!loading && !error && contacts.length === 0 && <p>No contacts found.</p>}

            {!loading && contacts.map((contact) => (

                <div key={contact._id} className="contact-item">

                    {editingId === contact._id ? (
                        <form onSubmit={handleUpdate}>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <>
                            <h2>
                                {contact.firstName} {contact.lastName}
                            </h2>
                            <p>Email: {contact.email}</p>
                            <p>Message: {contact.message}</p>

                            <button onClick={() => handleEdit(contact)}>Edit</button>
                            <button onClick={() => handleDelete(contact._id)}>Delete</button>
                        </>
                    )}
                </div>
            ))
        }
        </div>
    )
}

export default AdminContacts; 
