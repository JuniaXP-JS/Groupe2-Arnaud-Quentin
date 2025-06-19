/**
 * Test suite for the Footer component.
 *
 * @module Footer.spec
 */

import { screen } from '@testing-library/react';
import { act } from 'react';
import Footer from '../Footer';
import { renderWithProviders } from '../../../__tests__/test-utils';

describe('Footer', () => {
    /**
     * Should render copyright.
     */
    it('renders copyright', async () => {
        await act(async () => {
            renderWithProviders(<Footer />);
        });

        expect(screen.getByText(/tous droits réservés/i)).toBeInTheDocument();
    });

    /**
     * Should render the current year.
     */
    it('renders the current year', async () => {
        await act(async () => {
            renderWithProviders(<Footer />);
        });

        const year = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });
});