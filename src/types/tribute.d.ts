declare module 'tributejs' {
  export interface TributeItem<T> {
    original: T;
    string: string;
    index: number;
    score: number;
  }

  export interface UsernameItem {
    username: string;
  }

  interface TributeOptions<T> {
    trigger?: string;
    requireLeadingSpace?: boolean;
    spaceSelectsMatch?: boolean;
    selectTemplate?: (item: TributeItem<UsernameItem>) => string;
    menuItemTemplate?: (item: TributeItem<UsernameItem>) => string;
    lookup?: string;
    values?: ((text: string, cb: (values: T[]) => void) => void) | T[];
    noMatchTemplate?: () => string;
    selectKeys?: number[]
  }

  class Tribute<T> {
    constructor(options: TributeOptions<T>);
    attach(element: HTMLElement): void;
    detach(element: HTMLElement): void;
    selectItem(item: T, original: string): void;
    hideMenu(): void;
    menu: HTMLElement;
    isActive: boolean;
  }

  export default Tribute;
}
