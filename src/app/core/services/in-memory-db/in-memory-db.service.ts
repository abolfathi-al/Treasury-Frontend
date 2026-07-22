import { Injectable } from '@angular/core';

export {
  BasicInfo,
  MockCollectionName,
  MockRecord,
  MockUser,
  PlatformMetadata,
  User,
} from './in-memory-db.types';

import type {
  BasicInfo,
  MockCollectionName,
  MockRecord,
  MockUser,
  PlatformMetadata,
} from './in-memory-db.types';

@Injectable({ providedIn: 'root' })
export class InMemoryDbService {
  private readonly db = new Map<string, MockRecord[]>();

  constructor() {
    this.initDb();
  }

  getAll<T extends MockRecord = MockRecord>(collection: string): T[] {
    return this.cloneArray<T>(this.db.get(collection) ?? []);
  }

  getById<T extends MockRecord = MockRecord>(
    collection: string,
    id: number | string
  ): T | undefined {
    const match = (this.db.get(collection) ?? []).find(
      (item) => String(item.id) === String(id)
    );

    return match ? this.cloneRecord<T>(match) : undefined;
  }

  create<T extends MockRecord = MockRecord>(
    collection: string,
    item: Partial<T>
  ): T {
    const current = this.db.get(collection) ?? [];
    const record = {
      ...item,
      id: item.id ?? this.nextId(current),
    } as T;

    this.db.set(collection, [...current, this.cloneRecord(record)]);

    return this.cloneRecord(record);
  }

  update<T extends MockRecord = MockRecord>(
    collection: string,
    id: number | string,
    patch: Partial<T>
  ): T | undefined {
    const current = this.db.get(collection) ?? [];
    const index = current.findIndex((item) => String(item.id) === String(id));

    if (index < 0) {
      return undefined;
    }

    const updated = {
      ...current[index],
      ...patch,
      id: current[index].id,
    } as T;

    const next = [...current];
    next[index] = this.cloneRecord<T>(updated);
    this.db.set(collection, next);

    return this.cloneRecord<T>(updated);
  }

  delete(collection: string, id: number | string): boolean {
    const current = this.db.get(collection) ?? [];
    const next = current.filter((item) => String(item.id) !== String(id));

    if (next.length === current.length) {
      return false;
    }

    this.db.set(collection, next);
    return true;
  }

  private initDb(): void {
    this.setCollection('users', [
      {
        id: 1,
        name: 'Alireza Abolfathi',
        email: 'alireza.abolfathi@velora.demo',
        role: 'platform-admin',
        status: 'active',
        createdAt: '2026-01-15T08:00:00.000Z',
      },
      {
        id: 2,
        name: 'Neda Platform',
        email: 'neda.platform@velora.demo',
        role: 'operator',
        status: 'active',
        createdAt: '2026-02-20T08:00:00.000Z',
      },
      {
        id: 3,
        name: 'Velora Viewer',
        email: 'viewer@velora.demo',
        role: 'viewer',
        status: 'inactive',
        createdAt: '2026-03-10T08:00:00.000Z',
      },
    ] satisfies MockUser[]);

    this.setCollection('basicInformation', [
      {
        id: 1,
        companyName: 'Velora',
        logoUrl: 'assets/media/logos/default.svg',
        email: 'support@velora.app',
        phone: '+1 000 000 0000',
        address: 'Velora Enterprise Workspace',
        companyDescriptions: [
          'Velora is a clean enterprise shell for platform operations and access governance.',
          'This workspace keeps reusable UI, forms, layout, and shell services ready for future modules.',
        ],
        socialMediaLinks: [],
        footerNavSections: [
          {
            title: 'Workspace',
            items: [
              { label: 'Dashboard', commands: ['/dashboard'] },
            ],
          },
        ],
      },
    ] satisfies BasicInfo[]);

    this.setCollection('platformMetadata', [
      {
        id: 1,
        workspaceName: 'Velora Enterprise',
        environment: 'local',
        releaseChannel: 'clean-shell',
        capabilities: [
          'layout-shell',
          'shared-ui',
          'shared-forms',
          'shared-directives',
          'chart-directives',
          'i18n-ready',
        ],
        navigationPlaceholders: [
          { label: 'Dashboard', route: '/dashboard', enabled: true },
        ],
      },
    ] satisfies PlatformMetadata[]);
  }

  private setCollection<T extends MockRecord>(
    collection: MockCollectionName,
    items: readonly T[]
  ): void {
    this.db.set(collection, this.cloneArray(items));
  }

  private nextId(items: readonly MockRecord[]): number {
    const numericIds = items
      .map((item) => Number(item.id))
      .filter((id) => Number.isFinite(id));

    return numericIds.length ? Math.max(...numericIds) + 1 : 1;
  }

  private cloneArray<T extends MockRecord>(items: readonly MockRecord[]): T[] {
    return items.map((item) => this.cloneRecord<T>(item));
  }

  private cloneRecord<T extends MockRecord>(item: MockRecord): T {
    return JSON.parse(JSON.stringify(item)) as T;
  }
}
