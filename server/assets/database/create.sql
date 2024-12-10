create table "m_districts" (
                              district_id varchar(255) primary key,
                              province_id varchar(255),
                              vn_province varchar(255),
                              vn_district varchar(255),
                              eng_district varchar(255),
                              vn_type varchar(255),
                              eng_type varchar(255),
                              deleted integer default 0, -- 0:false, 1: temp, 2: permanent --
                              updated_at timestamp,
                              created_at timestamp
);

create table users (
                       user_id integer primary key generated always as identity ,
                       username varchar(255),
                       password text,
                       email text,
                       phone_number varchar(255),
                       deleted int,
                       updated_at timestamp,
                       created_at timestamp
);

create table statistics (
                            id integer primary key generated always as identity,
                            district_id varchar(255) references m_districts(district_id),
                            avg_value double precision,
                            time timestamp,
                            deleted integer default 0,
                            updated_at timestamp,
                            created_at timestamp

);

create table users_favorite (
                                id integer primary key generated always as identity ,
                                user_id integer references users,
                                district_id varchar(255) references m_districts,
                                deleted int,
                                updated_at timestamp,
                                created_at timestamp
);

create table users_session
(
    id            int generated always as identity primary key,
    user_id       int not null,
    session_id    varchar(255) not null ,
    access_token  text not null ,
    refresh_token text,
    deleted       int,
    updated_at    timestamp,
    created_at    timestamp

);

CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON m_districts
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON statistics
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON users_favorite
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE
    ON users_session
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();