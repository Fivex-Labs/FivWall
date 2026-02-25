/**
 * Refreshes Google OAuth access token using refresh token.
 * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (server-side only).
 */

import { NextRequest, NextResponse } from 'next/server';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export async function POST(request: NextRequest) {
    try {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.json(
                { error: 'Google OAuth not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { refresh_token } = body;

        if (!refresh_token || typeof refresh_token !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid refresh token' },
                { status: 400 }
            );
        }

        const params = new URLSearchParams({
            refresh_token,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
        });

        const tokenRes = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const tokenData = (await tokenRes.json()) as {
            access_token?: string;
            expires_in?: number;
            error?: string;
            error_description?: string;
        };

        if (!tokenRes.ok) {
            return NextResponse.json(
                {
                    error: tokenData.error || 'Token refresh failed',
                    description: tokenData.error_description,
                },
                { status: 400 }
            );
        }

        if (!tokenData.access_token) {
            return NextResponse.json(
                { error: 'No access token in response' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in ?? 3600,
        });
    } catch (err) {
        console.error('Google token refresh error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
