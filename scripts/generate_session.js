const icloud = require('@folk-org/apple-icloud');
const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');

async function main() {
    console.log('--- iCloud Session Generator ---');
    console.log('This script will help you generate a session JSON for n8n-nodes-icloud-drive-tools.');

    const username = prompt('Apple ID: ');
    const password = prompt('Password: ', { echo: '*' });

    try {
        const client = new icloud(
            {
                apple_id: username,
                password: password,
                trust_launcher: true,
                scope: ['drive', 'photos'],
            }
        );

        client.on('ready', async () => {
            console.log('Login successful!');
            const session = client.saveSession();
            console.log('\n--- Session JSON (Copy this to n8n) ---');
            console.log(JSON.stringify(session));
            console.log('---------------------------------------');
            process.exit(0);
        });

        client.on('err', (err) => {
            console.error('Error:', err);
            process.exit(1);
        });

        client.on('2fa', async (code) => {
            console.log('Two-factor authentication required.');
            const twoFactorCode = prompt('Enter 2FA code: ');
            // The library might handle this differently, checking docs/source would be ideal.
            // Assuming standard flow or re-init with code if needed, but apple-icloud usually emits 'ready' after successful 2FA handling if built-in.
            // Wait, apple-icloud usually requires handling the code.
            // Let's check how to submit the code.
            // Based on common usage of this lib:
            // client.sendSecurityCode(twoFactorCode);
            try {
                await client.securityCode(twoFactorCode);
            } catch (err) {
                console.error('Failed to send security code:', err);
            }
        });

        // Trigger login
        await client.login();

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
}

main();
