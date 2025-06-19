/**
 * Test suite for the LoginForm component.
 *
 * @module LoginForm.spec
 */

import { screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';

import * as axiosMock from '../../../__tests__/__mocks__/axios';

vi.mock('axios', () => axiosMock);
vi.mock('react-router-dom', () => import('../../../__tests__/__mocks__/react-router-dom'));
vi.mock('../../../contexts/session', () => import('../../../__tests__/__mocks__/session'));

import { useSession, mockSetSession } from '../../../__tests__/__mocks__/session';

import LoginForm from '../LoginForm';
import { renderWithProviders } from '../../../__tests__/test-utils';
import axios from 'axios';
import { mockNavigate } from '../../../__tests__/__mocks__/react-router-dom';

describe('LoginForm', () => {
    /**
     * Utility function to render the LoginForm with all providers.
     * @async
     */
    async function setup() {
        await act(async () => {
            renderWithProviders(<LoginForm />, {
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
     * Should render email and password fields and the submit button.
     * Verifies that the form inputs and submit button are present.
     */
    it('renders email and password fields', async () => {
        await setup();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    /**
     * Should navigate to register page when signup button is clicked.
     * Verifies that clicking the signup button triggers navigation.
     */
    it('navigates to register page when signup button is clicked', async () => {
        await setup();
        fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/auth/register');
    });

    /**
     * Should show error message on login failure.
     * Simulates a failed login and checks for error message display.
     */
    it('shows error message on login failure', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        (axios.post as any).mockRejectedValueOnce(new Error('Login failed'));

        await setup();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(screen.getByText(/email ou mot de passe invalide/i)).toBeInTheDocument();
        });

        expect(mockSetSession).not.toHaveBeenCalled();

        errorSpy.mockRestore();
    });

    /**
     * Should log in successfully and redirect to home page.
     * Simulates a successful login and checks for navigation and session update.
     */
    it('logs in successfully and redirects to home page', async () => {
        (axios.post as any).mockResolvedValueOnce({ data: { token: 'fake-token' } });

        await setup();

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'SecurePass123!' } });

        fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

        await waitFor(() => {
            expect(mockSetSession).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
        });
    });

    /**
     * Should handle form submission with empty fields.
     * Simulates submitting the form with empty fields and checks API call.
     */
    it('handles form submission with empty fields', async () => {
        // Mock console.error to suppress error message in logs
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        vi.clearAllMocks();

        (axios.post as any).mockRejectedValueOnce(new Error('Login failed with empty fields'));

        await setup();

        const form = document.querySelector('form');

        fireEvent.submit(form!);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/api/auth/login'),
                expect.objectContaining({
                    email: '',
                    password: ''
                }),
                expect.any(Object)
            );
        });

        expect(mockSetSession).not.toHaveBeenCalled();

        // Restore console.error
        errorSpy.mockRestore();
    });
});