--
-- PostgreSQL database dump
--

\restrict MCdk7BmJ8CZPhQe7PdNgpJpk1X72JrCSUJG4MFUK1omtvpzP8XFA1gjmLXFZxJv

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: syncspace
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    "googleId" character varying(255),
    avatar character varying(255) DEFAULT ''::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO syncspace;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: syncspace
--

COPY public.users (id, name, email, password, "googleId", avatar, "createdAt", "updatedAt") FROM stdin;
81388baf-b781-46ff-bf43-ab51b98b77a8	Strange	strangemilkyway@gmail.com	\N	102391794119302601942	https://lh3.googleusercontent.com/a/ACg8ocLZNQHN3M2cReRzxT9K5WHBJHMfkYEY78-C379JHoztwuWxhQ=s96-c	2026-06-30 09:00:28.726+00	2026-06-30 09:00:28.726+00
\.


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: syncspace
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_googleId_key; Type: CONSTRAINT; Schema: public; Owner: syncspace
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_googleId_key" UNIQUE ("googleId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: syncspace
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict MCdk7BmJ8CZPhQe7PdNgpJpk1X72JrCSUJG4MFUK1omtvpzP8XFA1gjmLXFZxJv

