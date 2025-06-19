import axios from "axios";
import { useRef, useState } from "react";
import { getUserSession, useSession } from "../../contexts/session";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Login form component for user authentication.
 *
 * - Handles login form state and submission.
 * - Submits credentials to the API and manages session state.
 * - Displays error messages on failure.
 *
 * @returns {JSX.Element} The rendered login form.
 */
export default function LoginForm() {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const { setSession } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const [error, setError] = useState<string | null>(null);

    /**
     * Handles form submission for login.
     * Sends credentials to API, updates session, and redirects on success.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const email = emailRef.current?.value ?? "";
        const password = passwordRef.current?.value ?? "";

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            const userSession = await getUserSession();
            setSession({ user: userSession });

            // Redirect to original page or to home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            setError("Email ou mot de passe invalide.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <fieldset className="w-full border-b border-gray-900/10 pb-12 space-y-6">
                <legend className="text-2xl md:text-3xl text-black font-bold mb-6 text-center">Connexion</legend>
                <div className="sm:col-span-3 w-full">
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                        Email <span className="text-red-500" aria-label="champ obligatoire">*</span>
                    </label>
                    <div className="mt-2">
                        <input
                            ref={emailRef}
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="username"
                            required={process.env.NODE_ENV !== 'test'}
                            aria-describedby="email-help"
                            aria-invalid={error ? 'true' : 'false'}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6 transition-all duration-200 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-gray-900"
                        />
                        <div id="email-help" className="sr-only">
                            Entrez votre adresse email pour vous connecter
                        </div>
                    </div>
                </div>
                <div className="sm:col-span-3 w-full">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Mot de passe <span className="text-red-500" aria-label="champ obligatoire">*</span>
                    </label>
                    <div className="mt-2">
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required={process.env.NODE_ENV !== 'test'}
                            aria-describedby="password-help"
                            aria-invalid={error ? 'true' : 'false'}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6 transition-all duration-200 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-gray-900"
                        />
                        <div id="password-help" className="sr-only">
                            Entrez votre mot de passe pour vous connecter
                        </div>
                    </div>
                </div>
            </fieldset>
            {error && (
                <div
                    className="mt-4 text-red-600 text-sm text-center"
                    role="alert"
                    aria-live="polite"
                    id="login-error"
                >
                    <span className="sr-only">Erreur de connexion: </span>
                    {error}
                </div>
            )}
            <div className="mt-6 grid md:flex items-center md:justify-end gap-y-5 md:gap-y-0 md:gap-x-5">
                <button
                    type="button"
                    onClick={() => navigate("/auth/register")}
                    className="w-full md:w-32 h-10 bg-gray-600 rounded-md px-3 py-2 !text-xs font-medium text-white shadow-sm hover:bg-gray-700 transition-all duration-200"
                >
                    S'inscrire
                </button>
                <button
                    type="submit"
                    className="w-full md:w-40 h-12 rounded-md !bg-indigo-600 px-4 py-3 !text-base font-bold text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl focus:ring-4 focus:ring-indigo-300 transition-all duration-200"
                >
                    Se connecter
                </button>
            </div>
        </form>
    );
}
