CREATE TABLE public.alerts_setting (
                                       id INTEGER PRIMARY KEY NOT NULL,
                                       user_id INTEGER NOT NULL,
                                       district_id CHARACTER VARYING(255) NOT NULL,
                                       wind_speed BOOLEAN NOT NULL DEFAULT true,
                                       aqi_index BOOLEAN NOT NULL DEFAULT true,
                                       pm_25 BOOLEAN NOT NULL DEFAULT true,
                                       temperature BOOLEAN NOT NULL DEFAULT true,
                                       weather BOOLEAN NOT NULL DEFAULT true,
                                       FOREIGN KEY (district_id) REFERENCES public.m_districts (district_id)
                                           MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
                                       FOREIGN KEY (user_id) REFERENCES public.users (user_id)
                                           MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE UNIQUE INDEX unique_alert_setting ON alerts_setting USING BTREE (user_id, district_id);

CREATE TABLE public."AQI_Supa" (
                                   fid INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('"AQI_Supa_fid_seq"'::regclass),
                                   the_geom GEOMETRY(POLYGON,4326),
                                   location CHARACTER VARYING,
                                   ingestion TIMESTAMP WITHOUT TIME ZONE,
                                   elevation INTEGER
);
CREATE INDEX "spatial_AQI_Supa_the_geom" ON "AQI_Supa" USING GIST (the_geom);

CREATE TABLE public.m_districts (
                                    district_id CHARACTER VARYING(255) PRIMARY KEY NOT NULL,
                                    province_id CHARACTER VARYING(255) NOT NULL,
                                    vn_province CHARACTER VARYING(255) NOT NULL,
                                    vn_district CHARACTER VARYING(255) NOT NULL,
                                    eng_district CHARACTER VARYING(255) NOT NULL,
                                    vn_type CHARACTER VARYING(255) NOT NULL,
                                    eng_type CHARACTER VARYING(255) NOT NULL,
                                    deleted INTEGER DEFAULT 0,
                                    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                                    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text)
);
CREATE INDEX idx_districts ON m_districts USING BTREE (district_id);

CREATE TABLE public.m_recommendation (
                                         id INTEGER PRIMARY KEY NOT NULL,
                                         min_threshold INTEGER NOT NULL,
                                         max_threshold INTEGER NOT NULL,
                                         en_status TEXT NOT NULL,
                                         color CHARACTER VARYING(255) NOT NULL,
                                         en_recommendation TEXT NOT NULL,
                                         vn_recommendation TEXT,
                                         vn_status TEXT
);

CREATE TABLE public.mail (
                             id INTEGER PRIMARY KEY NOT NULL,
                             subject TEXT NOT NULL,
                             html TEXT NOT NULL
);

CREATE TABLE public.spatial_ref_sys (
                                        srid INTEGER PRIMARY KEY NOT NULL,
                                        auth_name CHARACTER VARYING(256),
                                        auth_srid INTEGER,
                                        srtext CHARACTER VARYING(2048),
                                        proj4text CHARACTER VARYING(2048)
);

CREATE TABLE public.stations (
                                 station_id TEXT PRIMARY KEY NOT NULL,
                                 aqi_index INTEGER NOT NULL,
                                 status CHARACTER VARYING(255) NOT NULL,
                                 color CHARACTER VARYING(255) NOT NULL,
                                 timestamp TIMESTAMP WITHOUT TIME ZONE,
                                 lat DOUBLE PRECISION NOT NULL,
                                 lng DOUBLE PRECISION NOT NULL,
                                 geom GEOMETRY(POINT,4326),
                                 station_name TEXT,
                                 address TEXT,
                                 pm25 DOUBLE PRECISION
);

CREATE TABLE public.statistics (
                                   id INTEGER PRIMARY KEY NOT NULL,
                                   district_id CHARACTER VARYING(255),
                                   pm_25 DOUBLE PRECISION NOT NULL,
                                   aqi_index INTEGER NOT NULL,
                                   time TIMESTAMP WITH TIME ZONE,
                                   deleted INTEGER DEFAULT 0,
                                   updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                                   created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                                   FOREIGN KEY (district_id) REFERENCES public.m_districts (district_id)
                                       MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE INDEX idx_statistic ON statistics USING BTREE (district_id, time);
CREATE INDEX statistics_idx ON statistics USING BTREE (district_id, time);
CREATE UNIQUE INDEX unique_air_quality ON statistics USING BTREE (district_id, pm_25, aqi_index, time);

CREATE TABLE public.users (
                              user_id INTEGER PRIMARY KEY NOT NULL,
                              username CHARACTER VARYING(255) NOT NULL,
                              password TEXT NOT NULL,
                              email TEXT NOT NULL,
                              phone_number CHARACTER VARYING(255) NOT NULL,
                              deleted INTEGER DEFAULT 0,
                              updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                              created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                              role INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE public.users_notification (
                                           id INTEGER PRIMARY KEY NOT NULL,
                                           user_id INTEGER,
                                           location_id CHARACTER VARYING(255),
                                           recommendation_id INTEGER,
                                           timestamp TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                                           archived INTEGER DEFAULT 0,
                                           aqi_index INTEGER,
                                           FOREIGN KEY (location_id) REFERENCES public.m_districts (district_id)
                                               MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
                                           FOREIGN KEY (recommendation_id) REFERENCES public.m_recommendation (id)
                                               MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
                                           FOREIGN KEY (user_id) REFERENCES public.users (user_id)
                                               MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE UNIQUE INDEX users_notification_pk ON users_notification USING BTREE (timestamp, user_id);

CREATE TABLE public.users_session (
                                      id INTEGER PRIMARY KEY NOT NULL,
                                      user_id INTEGER NOT NULL,
                                      session_id CHARACTER VARYING(255) NOT NULL,
                                      access_token TEXT NOT NULL,
                                      refresh_token TEXT,
                                      deleted INTEGER,
                                      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                                      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text)
);

CREATE TABLE public.users_setting (
                                      id INTEGER PRIMARY KEY NOT NULL,
                                      user_id INTEGER,
                                      profile_url CHARACTER VARYING(255),
                                      user_location CHARACTER VARYING(255),
                                      deleted INTEGER DEFAULT 0,
                                      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                                      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc'::text),
                                      receive_notifications INTEGER DEFAULT 0,
                                      FOREIGN KEY (user_id) REFERENCES public.users (user_id)
                                          MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
                                      FOREIGN KEY (user_location) REFERENCES public.m_districts (district_id)
                                          MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);
CREATE UNIQUE INDEX users_setting_user_id_key ON users_setting USING BTREE (user_id);

