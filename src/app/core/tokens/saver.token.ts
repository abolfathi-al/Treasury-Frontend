import { InjectionToken } from '@angular/core';
import { saveAs } from 'file-saver';

export type Saver = (blob: Blob, filename?: string) => void;

export function getSaver(): Saver {
  return saveAs;
}

export const SAVER = new InjectionToken<Saver>(
  'Saver',
  {
    factory: (): Saver => saveAs
  }
);
