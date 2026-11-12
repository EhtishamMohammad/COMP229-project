import { useState } from "react";
import "./SignUp.css";

function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    }); 

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData) 
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }

            setStatus("Registration successful!");

            setFormData({
                name: "",
                email: "",
                password: "",
            })
            setShowPassword(false);

        } catch (error) {
            setStatus(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-page">
            <h2>Sign Up</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <div className="password-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                    />
                    <label>
                        <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={(event) => setShowPassword(event.target.checked)}
                        >
                        </input>
                        Show Password 
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
            {status && (
                <p role="status" aria-live="polite">{status}</p>
            )}
        </div>
    )
}

export default SignUp; 