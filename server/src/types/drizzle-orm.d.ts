declare module 'drizzle-orm' {
  // minimal typings used by this project
  export function desc<T>(arg: T): any;
  export function asc<T>(arg: T): any;
  export const eq: any;
  export type Any = any;
}

declare module 'drizzle-orm/node-postgres' {
  import { Pool } from 'pg';
  // drizzle returns a DB client with fluent methods; keep as any for now
  export function drizzle(pool: Pool): any;
}

declare module 'drizzle-orm/pg-core' {
  export function pgTable(name: string, cols: any): any;
  export function varchar(name: string, opts?: any): any;
  export function real(name: string, opts?: any): any;
  export function integer(name: string, opts?: any): any;
  export function timestamp(name: string, opts?: any): any;
  export function bigint(name: string, opts?: any);
}
