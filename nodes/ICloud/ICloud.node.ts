import {
    IDataObject,
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

// @ts-ignore
import icloud = require('@folk-org/apple-icloud');

export class ICloud implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'iCloud',
        name: 'iCloud',
        icon: 'file:icloud.png',
        group: ['input'],
        version: 1,
        description: 'Manage iCloud Drive files and media',
        defaults: {
            name: 'iCloud',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'iCloudApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'List',
                        value: 'list',
                        description: 'List files from iCloud Drive or Photos',
                        action: 'List files',
                    },
                    {
                        name: 'Download',
                        value: 'download',
                        description: 'Download a file',
                        action: 'Download a file',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete a file',
                        action: 'Delete a file',
                    },
                ],
                default: 'list',
            },
            // List Operations
            {
                displayName: 'Source',
                name: 'source',
                type: 'options',
                options: [
                    {
                        name: 'Drive',
                        value: 'drive',
                    },
                    {
                        name: 'Photos',
                        value: 'photos',
                    },
                ],
                default: 'photos',
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                description: 'Where to list files from',
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 10,
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                description: 'Max number of results to return',
            },
            // Download Operations
            {
                displayName: 'File Name',
                name: 'fileName',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['download'],
                    },
                },
                description: 'Name of the file to download (for Drive) or ID (for Photos)',
            },
            {
                displayName: 'Source',
                name: 'source',
                type: 'options',
                options: [
                    {
                        name: 'Drive',
                        value: 'drive',
                    },
                    {
                        name: 'Photos',
                        value: 'photos',
                    },
                ],
                default: 'photos',
                displayOptions: {
                    show: {
                        operation: ['download', 'delete'],
                    },
                },
                description: 'Source of the file',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const credentials = await this.getCredentials('iCloudApi');
        const sessionJson = credentials.sessionJson as string;

        if (!sessionJson) {
            throw new Error('No session JSON provided in credentials.');
        }

        let session;
        try {
            session = JSON.parse(sessionJson);
        } catch (e) {
            throw new Error('Invalid Session JSON. Please check your credentials.');
        }

        // Initialize iCloud client
        const client = new icloud({ session: session });

        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i) as string;

            try {
                if (operation === 'list') {
                    const source = this.getNodeParameter('source', i) as string;
                    const limit = this.getNodeParameter('limit', i) as number;

                    if (source === 'photos') {
                        // Implement photo listing
                        // Note: The library API might differ, assuming standard access
                        // Usually client.Photos.fetch() or similar.
                        // Based on apple-icloud docs (inferred):
                        // client.Photos.forEach(photo => ...)
                        // We need to collect them.

                        const photos: any[] = [];
                        // We might need to wait for the client to be ready?
                        // If session is passed, it might be ready immediately or need validation.
                        // Let's assume we can just access it.

                        // Using a promise wrapper if the lib uses callbacks or streams
                        // But apple-icloud usually exposes iterators or arrays.
                        // Let's try to access the albums or all photos.
                        // client.Photos is likely the entry point.

                        // For now, let's try to get the 'All Photos' album.
                        const album = client.Photos.albums['All Photos'];
                        if (album) {
                            const count = Math.min(limit, album.count);
                            // Fetching photos might be async or require fetching chunks.
                            // This is tricky without docs.
                            // Let's try to fetch recent items.
                            // client.Photos.fetchMedia(start, end) ?

                            // Let's assume a simpler API for now and refine.
                            // Actually, the python script used `api.photos.all`.
                            // The node lib might be similar.

                            // Let's try to just return a placeholder for now to verify the node runs,
                            // but I want to put some logic.
                            // Let's assume `client.Photos.fetch()` returns a promise with photos.

                            // Wait, I can search for usage examples of @folk-org/apple-icloud.
                        }

                        // Placeholder logic to avoid build errors and runtime crashes until verified
                        returnData.push({ json: { message: "Photo listing not fully implemented yet", source } });

                    } else {
                        // Implement drive listing
                        const drive = client.Drive;
                        // drive.getContent('/')
                        returnData.push({ json: { message: "Drive listing not fully implemented yet", source } });
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: (error as Error).message } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
