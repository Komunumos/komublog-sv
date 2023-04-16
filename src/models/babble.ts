export interface Babble {
	id: string;
	author: string;
	username?: string | undefined;
	avatar?: string | undefined;
	name?: string | undefined;
	babble: string;
	likes: number;
	reblabs: number;
	images?: string[] | undefined;
	postDate?: string | undefined;
}
