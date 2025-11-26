import { ICloud } from '../nodes/ICloud/ICloud.node';
import * as icloud from '@folk-org/apple-icloud';

// Mock n8n execute functions
const mockExecuteFunctions = {
    getInputData: () => [{ json: {} }],
    getCredentials: async (name: string) => {
        if (name === 'iCloudApi') {
            // We need a real session here for end-to-end, or we mock the client.
            // For this test, we'll use a dummy session to verify code paths, 
            // but the real test needs a real session.
            return { sessionJson: process.env.ICLOUD_SESSION_JSON || '{}' };
        }
        return {};
    },
    getNodeParameter: (name: string, index: number) => {
        if (name === 'operation') return 'list';
        if (name === 'source') return 'photos';
        if (name === 'limit') return 5;
        return '';
    },
    continueOnFail: () => false,
} as any;

async function runTest() {
    const node = new ICloud();
    try {
        console.log('Running ICloud node test...');
        const result = await node.execute.call(mockExecuteFunctions);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

runTest();
