CREATE EXTENSION IF NOT EXISTS postgis;

CREATE
OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER LANGUAGE plpgsql AS $ $ BEGIN NEW.updated_at = NOW() AT TIME ZONE 'utc' :: TEXT;

RETURN NEW;

END;

$ $;

CREATE TABLE IF NOT EXISTS m_districts (
    district_id VARCHAR(255) NOT NULL PRIMARY KEY,
    province_id VARCHAR(255) NOT NULL,
    vn_province VARCHAR(255) NOT NULL,
    vn_district VARCHAR(255) NOT NULL,
    eng_district VARCHAR(255) NOT NULL,
    vn_type VARCHAR(255) NOT NULL,
    eng_type VARCHAR(255) NOT NULL,
    deleted INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT),
    created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT)
);

CREATE INDEX IF NOT EXISTS idx_districts ON m_districts (district_id);

CREATE TRIGGER set_updated_at BEFORE
UPDATE
    ON m_districts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    role INTEGER DEFAULT 1 NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    deleted INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT),
    created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT)
);

CREATE TRIGGER set_updated_at BEFORE
UPDATE
    ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS users_config (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    profile_url VARCHAR(255),
    user_district_id VARCHAR(255) REFERENCES m_districts (district_id),
    email_notification BOOLEAN DEFAULT TRUE,
    phone_notification BOOLEAN DEFAULT TRUE,
    deleted INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT),
    created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT)
);

CREATE TRIGGER set_updated_at BEFORE
UPDATE
    ON users_config FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS users_session (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    deleted INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT),
    created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT)
);

CREATE TRIGGER set_updated_at BEFORE
UPDATE
    ON users_session FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS statistics (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    district_id VARCHAR(255) REFERENCES m_districts,
    pm_25 DOUBLE PRECISION NOT NULL,
    aqi_index INTEGER NOT NULL,
    time TIMESTAMP WITH TIME ZONE,
    deleted INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT)
);

CREATE INDEX IF NOT EXISTS idx_statistic ON statistics (district_id, time);

CREATE TRIGGER set_updated_at BEFORE
UPDATE
    ON statistics FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS stations (
    station_id VARCHAR(255) NOT NULL PRIMARY KEY,
    station_name TEXT NOT NULL,
    status VARCHAR(255) NOT NULL,
    lng DOUBLE PRECISION,
    lat DOUBLE PRECISION,
    aqi_index INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE,
    deleted INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc' :: TEXT)
);

CREATE TRIGGER set_updated_at BEFORE
UPDATE
    ON stations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS points_data (
    id SERIAL PRIMARY KEY,
    point_value INTEGER NOT NULL,
    geom geometry(Point, 4326),
    name TEXT
);

CREATE INDEX IF NOT EXISTS points_data_geom_idx ON points_data USING gist (geom);

CREATE TABLE IF NOT EXISTS stations_point_map (
    station_id TEXT NOT NULL PRIMARY KEY,
    aqi_index INTEGER NOT NULL,
    status VARCHAR(255) NOT NULL,
    color VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    geom geometry(Point, 4326)
);

CREATE INDEX IF NOT EXISTS stations_point_map_geom_idx ON stations_point_map USING gist (geom);