export const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

const el = <T extends HTMLElement>(id: string): { readonly value: T } => ({
  get value(): T {
    return $<T>(id);
  }
});

export const dom = {
  views: {
    get dashboard(): HTMLDivElement { return el<HTMLDivElement>('view-dashboard').value; },
    get generator(): HTMLDivElement { return el<HTMLDivElement>('view-generator').value; }
  },
  nav: {
    get dashboard(): HTMLDivElement { return el<HTMLDivElement>('nav-dashboard').value; },
    get generator(): HTMLDivElement { return el<HTMLDivElement>('nav-generator').value; },
    get settings(): HTMLDivElement { return el<HTMLDivElement>('nav-settings').value; }
  },
  modals: {
    get entry(): HTMLDivElement { return el<HTMLDivElement>('modal-entry').value; },
    get settings(): HTMLDivElement { return el<HTMLDivElement>('modal-settings').value; }
  },
  gen: {
    get result(): HTMLDivElement { return el<HTMLDivElement>('gen-result').value; },
    get lengthSlider(): HTMLInputElement { return el<HTMLInputElement>('gen-length').value; },
    get lengthVal(): HTMLSpanElement { return el<HTMLSpanElement>('gen-length-val').value; },
    get chkUpper(): HTMLInputElement { return el<HTMLInputElement>('chk-upper').value; },
    get chkLower(): HTMLInputElement { return el<HTMLInputElement>('chk-lower').value; },
    get chkNumber(): HTMLInputElement { return el<HTMLInputElement>('chk-number').value; },
    get chkSymbol(): HTMLInputElement { return el<HTMLInputElement>('chk-symbol').value; },
    get btnGen(): HTMLButtonElement { return el<HTMLButtonElement>('btn-generate').value; },
    get btnCopy(): HTMLButtonElement { return el<HTMLButtonElement>('btn-gen-copy').value; }
  },
  settings: {
    get path(): HTMLInputElement { return el<HTMLInputElement>('settings-path').value; },
    get password(): HTMLInputElement { return el<HTMLInputElement>('settings-password').value; },
    get legacyPath(): HTMLInputElement { return el<HTMLInputElement>('legacy-source-path').value; },
    get encryptedPath(): HTMLInputElement { return el<HTMLInputElement>('legacy-target-path').value; },
    get migratePassword(): HTMLInputElement { return el<HTMLInputElement>('migration-password').value; }
  },
  get list(): HTMLTableSectionElement { return el<HTMLTableSectionElement>('password-list').value; },
  get totalCount(): HTMLSpanElement { return el<HTMLSpanElement>('total-count').value; },
  get emptyState(): HTMLDivElement { return el<HTMLDivElement>('empty-state').value; },
  get statusText(): HTMLParagraphElement { return el<HTMLParagraphElement>('status-text').value; },
  get pathDisplay(): HTMLSpanElement { return el<HTMLSpanElement>('storage-path-display').value; },
  get encryptionStatus(): HTMLParagraphElement { return el<HTMLParagraphElement>('encryption-status').value; },
  get searchInput(): HTMLInputElement { return el<HTMLInputElement>('search-input').value; },
  get headerTitle(): HTMLHeadingElement { return el<HTMLHeadingElement>('header-title').value; },
  get headerSearch(): HTMLDivElement { return el<HTMLDivElement>('header-search-container').value; },
  get btnAdd(): HTMLButtonElement { return el<HTMLButtonElement>('btn-add').value; },
  get entryForm(): HTMLFormElement { return el<HTMLFormElement>('entry-form').value; },
  get btnQuickGen(): HTMLButtonElement { return el<HTMLButtonElement>('btn-quick-gen').value; }
};
