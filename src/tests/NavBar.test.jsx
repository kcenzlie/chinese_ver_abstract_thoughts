import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from '../context/auth-context'; // Import AuthProvider
import NavBar from '../components/NavBar';
import supabase from '../helper/supabaseClient';
import '@testing-library/jest-dom'; // Import jest-dom for toBeInTheDocument matcher

// Mock Supabase client
jest.mock('../helper/supabaseClient', () => ({
    auth: {
        getSession: jest.fn(),
        onAuthStateChange: jest.fn((callback) => {
            const subscription = { unsubscribe: jest.fn() };
            callback(null, { user: { id: 'user-123' } });
            return { data: { subscription } };
        }),
    },
    from: jest.fn(),
    channel: jest.fn(() => ({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
        removeChannel: jest.fn(),
    })),
    removeChannel: jest.fn(), // Add removeChannel mock
}));

describe('NavBar Component', () => {
    const renderWithProviders = (ui) => {
        return render(
            <AuthProvider>
                <BrowserRouter>{ui}</BrowserRouter>
            </AuthProvider>
        );
    };

    it('should display 💗 when there are new comments', async () => {
        // Mock session
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: 'user-123' } } },
        });

        // Mock posts
        supabase.from.mockImplementation((table) => {
            if (table === 'Post') {
                return {
                    select: jest.fn().mockReturnValue({
                        eq: jest.fn().mockReturnValue({
                            then: jest.fn((callback) =>
                                callback({
                                    data: [
                                        { id: 'post-1', created_at: '2023-01-01T00:00:00Z' },
                                    ],
                                    error: null,
                                })
                            ),
                        }),
                    }),
                };
            }

            if (table === 'Comments') {
                return {
                    select: jest.fn().mockReturnValue({
                        in: jest.fn().mockReturnValue({
                            gt: jest.fn().mockReturnValue({
                                then: jest.fn((callback) =>
                                    callback({
                                        data: [{ id: 'comment-1' }],
                                        error: null,
                                    })
                                ),
                            }),
                        }),
                    }),
                };
            }

            return { select: jest.fn() };
        });

        // Render NavBar
        await act(async () => {
            renderWithProviders(<NavBar />);
        });

        // Check if 💗 is displayed
        expect(screen.getByText(/Message/i)).toBeInTheDocument();
        expect(screen.getByText('💗')).toBeInTheDocument();
    });

    it('should not display 💗 when there are no new comments', async () => {
        // Mock session
        supabase.auth.getSession.mockResolvedValue({
            data: { session: { user: { id: 'user-123' } } },
        });

        // Mock posts
        supabase.from.mockImplementation((table) => {
            if (table === 'Post') {
                return {
                    select: jest.fn().mockReturnValue({
                        eq: jest.fn().mockReturnValue({
                            then: jest.fn((callback) =>
                                callback({
                                    data: [
                                        { id: 'post-1', created_at: '2023-01-01T00:00:00Z' },
                                    ],
                                    error: null,
                                })
                            ),
                        }),
                    }),
                };
            }

            if (table === 'Comments') {
                return {
                    select: jest.fn().mockReturnValue({
                        in: jest.fn().mockReturnValue({
                            gt: jest.fn().mockReturnValue({
                                then: jest.fn((callback) =>
                                    callback({
                                        data: [],
                                        error: null,
                                    })
                                ),
                            }),
                        }),
                    }),
                };
            }

            return { select: jest.fn() };
        });

        // Render NavBar
        await act(async () => {
            renderWithProviders(<NavBar />);
        });

        // Check if 💗 is not displayed
        expect(screen.getByText(/Message/i)).toBeInTheDocument();
        expect(screen.queryByText('💗')).not.toBeInTheDocument();
    });
});
