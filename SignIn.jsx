import { useState } from "react";
import "./SignIn.css";
import { useAuth } from "../context/AuthContext.jsx";

function SignIn() {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
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
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to login');
            }

            login(result.user, result.token);

            setStatus("Login successful!"); 

            setFormData({
                email: "",
                password: "",
            });
            setShowPassword(false); 

        } catch (error) {
            setStatus(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-page">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>
            {status && (
                <p role="status" aria-live="polite">{status}</p>
            )}
        </div>
    )
}

export default SignIn;