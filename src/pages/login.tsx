import { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import logo from '../assets/logo.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './login.css'
import { useNavigate } from 'react-router-dom'
import { login } from "../services/AuthService"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [viewPassword, setViewPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    const signIn = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        console.log({ email, password })
        // intiate the before api request sending (waiting conditions)
        setLoading(true);
        setError("");

        // send the api
        try {
            await login(email, password);   // from AuthService
            const role = localStorage.getItem("role");

            if (role === "ADMIN") navigate("/admin/dashboard");
            else if (role === "FLEET_MANAGER") navigate("/fleet-manager/dashboard");
        }
        catch (error: any) {
            console.log(error)
            console.log(error?.message)
            setError(error.response?.data?.error || "Login Failed , Please Try Again!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container fluid className="min-vh-100 p-0" style={{ backgroundColor: '#ABC9F5' }}>
            <Row className="g-0 min-vh-100">

                {/* LEFT SIDE */}
                <Col md={4} className="d-none d-md-flex flex-column justify-content-center align-items-center left-panel">
                    <div className='d-flex flex-column align-items-start'>
                        <h2 className="login-text text-white mb-2">Welcome to</h2>
                        <h1 className="logo-text brand-color mb-3">Guardian Drive!</h1>
                        <h4 className="login-text text-white">Smart fleet control starts here.</h4>
                    </div>
                    <img src={logo} alt="Guardian Drive Logo" className="img-fluid mt-5 logo-image" />
                </Col>

                {/* RIGHT SIDE */}
                <Col md={8} className="bg-white login-form">
                    <div className="form-container">

                        {/* MOBILE HEADER */}
                        <div className="d-md-none text-center mb-5">
                            <h2 className="login-text brand-color">Welcome to</h2>
                            <h1 className="logo-text brand-color">Guardian Drive!</h1>
                            <img src={logo} alt="Guardian Drive Logo" className="img-fluid mobile-logo mb-4" />
                        </div>

                        <div className="mb-5">
                            <h3 className="brand-color mb-3">Login to Account</h3>
                            <p className="login-text text-muted mb-0">Please enter your email and password to continue</p>
                        </div>

                        {/* FORM */}
                        <Form onSubmit={signIn}>

                            <Form.Group className="mb-4">
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    className="login-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4 position-relative">
                                <Form.Control
                                    type={viewPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    className="login-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <i
                                    className={`bi ${viewPassword ? 'bi-eye' : 'bi-eye-slash'} eye-icon`}
                                    onClick={() => setViewPassword(!viewPassword)}
                                ></i>
                            </Form.Group>

                            {/* if error exist show it */}
                            {error && (
                                <p className="text-danger text-center mt-2">{error}</p>
                            )}

                            <Button
                                type="submit"
                                variant={loading ? "secondary" : "primary"}
                                className="login-button"
                                disabled={loading}
                            > Sign In
                            </Button>

                            <div className="text-center mt-4">
                                <a href="./forget-password" className="text-decoration-none text-muted">Forgot Password?</a>
                            </div>

                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Login