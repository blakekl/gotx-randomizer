--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Debian 15.10-1.pgdg120+1)
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO gotx;

--
-- Name: completions; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.completions (
    id bigint NOT NULL,
    completed_at timestamp without time zone NOT NULL,
    nomination_id bigint,
    user_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    rpg_achievements boolean DEFAULT false
);


ALTER TABLE public.completions OWNER TO gotx;

--
-- Name: completions_id_seq; Type: SEQUENCE; Schema: public; Owner: gotx
--

CREATE SEQUENCE public.completions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.completions_id_seq OWNER TO gotx;

--
-- Name: completions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gotx
--

ALTER SEQUENCE public.completions_id_seq OWNED BY public.completions.id;


--
-- Name: games; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.games (
    id bigint NOT NULL,
    title_usa character varying,
    title_eu character varying,
    title_jp character varying,
    title_world character varying,
    title_other character varying,
    year character varying,
    systems text[] DEFAULT '{}'::text[],
    developer character varying,
    genres text[] DEFAULT '{}'::text[],
    img_url character varying,
    time_to_beat integer,
    screenscraper_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    igdb_id bigint
);


ALTER TABLE public.games OWNER TO gotx;

--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: gotx
--

CREATE SEQUENCE public.games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_id_seq OWNER TO gotx;

--
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gotx
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- Name: nominations; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.nominations (
    id bigint NOT NULL,
    nomination_type character varying DEFAULT 'gotm'::character varying NOT NULL,
    description character varying,
    winner boolean DEFAULT false,
    game_id bigint,
    user_id bigint,
    theme_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.nominations OWNER TO gotx;

--
-- Name: nominations_id_seq; Type: SEQUENCE; Schema: public; Owner: gotx
--

CREATE SEQUENCE public.nominations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nominations_id_seq OWNER TO gotx;

--
-- Name: nominations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gotx
--

ALTER SEQUENCE public.nominations_id_seq OWNED BY public.nominations.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO gotx;

--
-- Name: streaks; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.streaks (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    start_date date NOT NULL,
    end_date date,
    last_incremented date,
    streak_count integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.streaks OWNER TO gotx;

--
-- Name: streaks_id_seq; Type: SEQUENCE; Schema: public; Owner: gotx
--

CREATE SEQUENCE public.streaks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.streaks_id_seq OWNER TO gotx;

--
-- Name: streaks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gotx
--

ALTER SEQUENCE public.streaks_id_seq OWNED BY public.streaks.id;


--
-- Name: themes; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.themes (
    id bigint NOT NULL,
    creation_date date NOT NULL,
    title character varying NOT NULL,
    description character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    nomination_type character varying DEFAULT 'gotm'::character varying
);


ALTER TABLE public.themes OWNER TO gotx;

--
-- Name: themes_id_seq; Type: SEQUENCE; Schema: public; Owner: gotx
--

CREATE SEQUENCE public.themes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.themes_id_seq OWNER TO gotx;

--
-- Name: themes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gotx
--

ALTER SEQUENCE public.themes_id_seq OWNED BY public.themes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: gotx
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying NOT NULL,
    discord_id bigint,
    old_discord_name character varying,
    current_points double precision DEFAULT 0.0,
    redeemed_points double precision DEFAULT 0.0,
    earned_points double precision DEFAULT 0.0,
    premium_points double precision DEFAULT 0.0,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    premium_subscriber character varying
);


ALTER TABLE public.users OWNER TO gotx;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: gotx
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO gotx;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gotx
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: completions id; Type: DEFAULT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.completions ALTER COLUMN id SET DEFAULT nextval('public.completions_id_seq'::regclass);


--
-- Name: games id; Type: DEFAULT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- Name: nominations id; Type: DEFAULT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.nominations ALTER COLUMN id SET DEFAULT nextval('public.nominations_id_seq'::regclass);


--
-- Name: streaks id; Type: DEFAULT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.streaks ALTER COLUMN id SET DEFAULT nextval('public.streaks_id_seq'::regclass);


--
-- Name: themes id; Type: DEFAULT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.themes ALTER COLUMN id SET DEFAULT nextval('public.themes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: completions completions_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.completions
    ADD CONSTRAINT completions_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: nominations nominations_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.nominations
    ADD CONSTRAINT nominations_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: streaks streaks_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_pkey PRIMARY KEY (id);


--
-- Name: themes themes_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.themes
    ADD CONSTRAINT themes_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_completions_on_nomination_id; Type: INDEX; Schema: public; Owner: gotx
--

CREATE INDEX index_completions_on_nomination_id ON public.completions USING btree (nomination_id);


--
-- Name: index_completions_on_user_id; Type: INDEX; Schema: public; Owner: gotx
--

CREATE INDEX index_completions_on_user_id ON public.completions USING btree (user_id);


--
-- Name: index_nominations_on_game_id; Type: INDEX; Schema: public; Owner: gotx
--

CREATE INDEX index_nominations_on_game_id ON public.nominations USING btree (game_id);


--
-- Name: index_nominations_on_theme_id; Type: INDEX; Schema: public; Owner: gotx
--

CREATE INDEX index_nominations_on_theme_id ON public.nominations USING btree (theme_id);


--
-- Name: index_nominations_on_user_id; Type: INDEX; Schema: public; Owner: gotx
--

CREATE INDEX index_nominations_on_user_id ON public.nominations USING btree (user_id);


--
-- Name: index_streaks_on_user_id; Type: INDEX; Schema: public; Owner: gotx
--

CREATE INDEX index_streaks_on_user_id ON public.streaks USING btree (user_id);


--
-- Name: streaks fk_rails_53e6492959; Type: FK CONSTRAINT; Schema: public; Owner: gotx
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT fk_rails_53e6492959 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

