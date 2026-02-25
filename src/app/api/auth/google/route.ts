/**
 * Exchanges Google OAuth authorization code for access and refresh tokens.
 * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (server-side only).
 */

import { NextRequest, NextResponse } from 'next/server';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

function getRedirectUris(): string[] {
    const uris = process.env.GOOGLE_REDIRECT_URIS;
    if (uris) return uris.split(',').map((u) => u.trim());
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) return [appUrl];
    return ['http://localhost:3000', 'https://localhost:3000'];
}

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
        const { code, redirect_uri: clientRedirectUri } = body;

        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { error: 'Missing or invalid authorization code' },
                { status: 400 }
            );
        }

        const allowedUris = getRedirectUris();
        const origin = request.headers.get('origin') ?? undefined;
        // Use client's redirect_uri if it matches Origin (same-origin request) or is in allowed list
        const redirectUri =
            clientRedirectUri &&
            (allowedUris.includes(clientRedirectUri) || origin === clientRedirectUri)
                ? clientRedirectUri
                : allowedUris[0];

        const params = new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
        });

        const tokenRes = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        const tokenData = (await tokenRes.json()) as {
            access_token?: string;
            refresh_token?: string;
            expires_in?: number;
            error?: string;
            error_description?: string;
        };

        if (!tokenRes.ok) {
            return NextResponse.json(
                {
                    error: tokenData.error || 'Token exchange failed',
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
            refresh_token: tokenData.refresh_token ?? null,
            expires_in: tokenData.expires_in ?? 3600,
        });
    } catch (err) {
        console.error('Google token exchange error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
