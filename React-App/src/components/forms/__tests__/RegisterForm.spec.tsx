/**
 * Test suite for the RegisterForm component.
 *
 * @module RegisterForm.spec
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

import * as axiosMock from '../../../__tests__/__mocks__/axios';

vi.mock('axios', () => axiosMock);
vi.mock('react-router-dom', () => import('../../../__tests__/__mocks__/react-router-dom'));
vi.mock('../../../contexts/session', () => import('../../../__tests__/__mocks__/session'));

import { useSession, mockSetSession, getUserSession } from '../../../__tests__/__mocks__/session';
import { mockNavigate } from '../../../__tests__/__mocks__/react-router-dom';

import RegisterForm from '../RegisterForm';
import { renderWithProviders } from '../../../__tests__/test-utils';
import axios from 'axios';

describe('RegisterForm', () => {
    /**
     * Utility to render the RegisterForm with providers and reset mocks.
     * @async
     */
    async function setup() {
        mockNavigate.mockClear();
        mockSetSession.mockClear();

        getUserSession.mockResolvedValue({ name: 'Jane Doe', email: 'jane@example.com' });

        await act(async () => {
            renderWithProviders(<RegisterForm />, {
                withSession: true,
                withRouter: true
            });
        });
    }

    beforeEach(() => {
        // Reset all mocks and set up default session mock before each test.
        vi.clearAllMocks();

        useSession.mockReturnValue({
            session: { user: null },
            setSession: mockSetSession
        });
    });

    /**
     * Should render email and password fields.
     */
    it('renders email and password fields', async () => {
        await setup();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    });

    /**
     * Should show error for invalid email input.
     */
    it('shows error for invalid email', async () => {
        await setup();
        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'invalid' } });
        fireEvent.blur(emailInput);
        expect(await screen.findByText(/format d'email invalide/i)).toBeInTheDocument();
    });

    /**
     * Should show error for invalid password input.
     */
    it('shows error for invalid password', async () => {
        await setup();
        const passwordInput = screen.getByLabelText(/mot de passe/i);
        fireEvent.change(passwordInput, { target: { value: 'short' } });
        fireEvent.blur(passwordInput);
        expect(await screen.findByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(/le mot de passe doit contenir au moins 8 caractères/i)).toBeVisible();
    });

    /**
     * Should show a general error message on registration failure.
     */
    it('shows general error on registration failure', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        (axios.post as any).mockRejectedValueOnce(new Error('Registration failed'));

        await setup();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'SecurePass123!' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        await waitFor(() => {
            expect(screen.getByText(/l'inscription a échoué/i)).toBeInTheDocument();
        });

        expect(mockSetSession).not.toHaveBeenCalled();

        errorSpy.mockRestore();
    });

    /**
     * Should call setSession and redirect on successful registration.
     */
    it('calls setSession and redirects on successful registration', async () => {
        (axios.post as any).mockResolvedValueOnce({ data: { message: 'Registration successful' } });

        await setup();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'SecurePass123!' } });

        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

        await waitFor(() => {
            expect(mockSetSession).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});