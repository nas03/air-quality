/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface MDistricts {
  created_at: Generated<Timestamp | null>;
  deleted: Generated<number | null>;
  district_id: string;
  eng_district: string | null;
  eng_type: string | null;
  province_id: string | null;
  updated_at: Generated<Timestamp | null>;
  vn_district: string | null;
  vn_province: string | null;
  vn_type: string | null;
}

export interface Statistics {
  created_at: Generated<Timestamp | null>;
  deleted: Generated<number | null>;
  district_id: string | null;
  id: Generated<number>;
  pm_25: number | null;
  time: Timestamp | null;
  updated_at: Generated<Timestamp | null>;
}

export interface Users {
  created_at: Generated<Timestamp | null>;
  deleted: number | null;
  email: string | null;
  password: string | null;
  phone_number: string | null;
  updated_at: Generated<Timestamp | null>;
  user_id: Generated<number>;
  username: string | null;
}

export interface UsersFavorite {
  created_at: Generated<Timestamp | null>;
  deleted: number | null;
  district_id: string | null;
  id: Generated<number>;
  updated_at: Generated<Timestamp | null>;
  user_id: number | null;
}

export interface UsersSession {
  access_token: string;
  created_at: Timestamp | null;
  deleted: number | null;
  id: Generated<number>;
  refresh_token: string | null;
  session_id: string;
  updated_at: Timestamp | null;
  user_id: number;
}

export interface DB {
  m_districts: MDistricts;
  statistics: Statistics;
  users: Users;
  users_favorite: UsersFavorite;
  users_session: UsersSession;
}
