export interface ModalComponentInstance {
  handleCloseModal?: () => void;
  [key: string]: unknown;
}

export interface ModalRef {
  componentInstance: ModalComponentInstance;
  close: () => void;
}

export interface AppComponentConfig {
  onOverlayChange?: () => void;
  onModalRefsChange?: (modalRefs: ModalRef[]) => void;
}

export interface KeyboardEventConfig {
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export interface FocusTarget {
  element: HTMLElement;
  offset?: number;
  skipValidation?: boolean;
}
