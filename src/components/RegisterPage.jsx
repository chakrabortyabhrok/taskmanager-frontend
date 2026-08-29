import { useState } from "react";

// Define API_BASE at the top of the file
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForm = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/auth/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, password2:confirmPassword }),
            });

            const data = await response.json();
            console.log("Django Response:", data);

            if (!response.ok) {
                setError(data.detail || JSON.stringify(data) || "Registration Failed");
            } else {
                console.log("Success! Redirect to login here.");
            }

        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <h2>Register Test</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            <form onSubmit={handleForm} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
                <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}