import { ICloud } from '../nodes/ICloud/ICloud.node';
// @ts-ignore
import * as icloud from '@folk-org/apple-icloud';

// Mock n8n execute functions
const mockExecuteFunctions = {
    getInputData: () => [{ json: {} }],
    getCredentials: async (name: string) => {
        if (name === 'iCloudApi') {
            if (!process.env.ICLOUD_SESSION_JSON) {
                console.warn('WARNING: ICLOUD_SESSION_JSON environment variable is not set.');
                console.warn('The test will likely fail with a connection or parsing error.');
                console.warn('Please set ICLOUD_SESSION_JSON to a valid iCloud session JSON string.');
            }
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
