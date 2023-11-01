import { v2 } from '@google-cloud/translate';

export const translate = new v2.Translate({
	credentials: {
		type: process.env.TYPE!,
		project_id: process.env.PROJECT_ID!,
		private_key: process.env.PRIVATE_KEY!.replace(/\\n/g, '\n'),
		client_email: process.env.CLIENT_EMAIL!,
		client_id: process.env.CLIENT_ID!,
	},
	projectId: process.env.PROJECT_ID!,
});
