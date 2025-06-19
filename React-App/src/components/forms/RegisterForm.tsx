import { getUserSession, useSession } from "../../contexts/session";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Registration form component for new user sign up.
 *
 * - Handles email and password validation.
 * - Submits registration data to the API.
 * - Displays error messages and redirects on success.
 *
 * @returns {JSX.Element} The rendered registration form.
 */
export default function RegisterForm() {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const { setSession } = useSession();

    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    /**
     * Validate email format.
     * @param {string} email - The email to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    const validateEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    /**
     * Validate password format.
     * @param {string} password - The password to validate.
     * @returns {boolean} True if valid, false otherwise.
     */
    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    /**
     * Handles change event for the email input.
     * Sets error state if the email is invalid.
     */
    const handleEmailChange = () => {
        if (emailRef.current) {
            const email = emailRef.current.value;
            if (!validateEmail(email)) {
                setEmailError("Format d'email invalide");
            } else {
                setEmailError(null);
            }
        }
    };

    /**
     * Handles change event for the password input.
     * Sets error state if the password is invalid.
     */
    const handlePasswordChange = () => {
        if (passwordRef.current) {
            const password = passwordRef.current.value;
            if (!validatePassword(password)) {
                setPasswordError(
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
                );
            } else {
                setPasswordError(null);
            }
        }
    };

    /**
     * Handles form submission for registration.
     * Validates inputs, sends data to API, and manages session state.
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!emailRef.current || !passwordRef.current) return;

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        setFormError(null);

        if (!validateEmail(email)) {
            setEmailError("Format d'email invalide");
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.");
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                { email, password },
                { withCredentials: true }
            );

            const userSession = await getUserSession();
            setSession({ user: userSession });

            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
            setFormError("L'inscription a échoué. Veuillez réessayer.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <fieldset className="w-full border-b border-gray-900/10 pb-12 space-y-6">
                <legend className="text-2xl md:text-3xl text-black font-bold mb-6 text-center">Inscription</legend>
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
                            required
                            onChange={handleEmailChange}
                            aria-describedby="email-help email-error"
                            aria-invalid={emailError ? 'true' : 'false'}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6 transition-all duration-200 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-gray-900"
                        />
                        <div id="email-help" className="sr-only">
                            Entrez une adresse email valide pour créer votre compte
                        </div>
                    </div>
                    {emailError && (
                        <div id="email-error" className="mt-1 text-red-600 text-sm" role="alert" aria-live="polite">
                            <span className="sr-only">Erreur email: </span>
                            {emailError}
                        </div>
                    )}
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
                            autoComplete="new-password"
                            required
                            onChange={handlePasswordChange}
                            aria-describedby="password-help password-error"
                            aria-invalid={passwordError ? 'true' : 'false'}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6 transition-all duration-200 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:text-gray-900"
                        />
                        <div id="password-help" className="sr-only">
                            Créez un mot de passe sécurisé avec au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
                        </div>
                    </div>
                    {passwordError && (
                        <div id="password-error" className="mt-1 text-red-600 text-sm" role="alert" aria-live="polite">
                            <span className="sr-only">Erreur mot de passe: </span>
                            {passwordError}
                        </div>
                    )}
                </div>
            </fieldset>
            {formError && (
                <div className="mt-4 text-red-600 text-sm text-center" role="alert" aria-live="polite">
                    <span className="sr-only">Erreur de formulaire: </span>
                    {formError}
                </div>
            )}
            <div className="mt-6 grid md:flex items-center md:justify-end gap-y-5 md:gap-y-0 md:gap-x-5">
                <button
                    type="button"
                    onClick={() => navigate("/auth/login")}
                    className="w-full md:w-32 h-10 bg-gray-600 rounded-md px-3 py-2 !text-xs font-medium text-white shadow-sm hover:bg-gray-700 transition-all duration-200"
                >
                    Se connecter
                </button>
                <button
                    type="submit"
                    className="w-full md:w-40 h-12 rounded-md !bg-indigo-600 px-4 py-3 !text-base font-bold text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl focus:ring-4 focus:ring-indigo-300 transition-all duration-200"
                >
                    S'inscrire
                </button>
            </div>
        </form>
    );
}