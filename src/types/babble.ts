export interface Babble {
    id?: string | undefined;
    author: string;
    username?: string | undefined;
    avatar?: string | undefined;
    name?: string | undefined;
    babble: string;
    likes: number;
    reblabs: number;
    images?: string[] | undefined;
  }