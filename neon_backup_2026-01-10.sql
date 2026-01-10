--
-- PostgreSQL database dump
--

\restrict VRXlbRFEdF864fbwbdlRs5ixR2GugkDVLlOOGmzxyL700K7wCznO2XlW6bEEVGT

-- Dumped from database version 17.7 (e429a59)
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."UserRole" AS ENUM (
    'client',
    'attorney',
    'employer',
    'admin'
);


ALTER TYPE public."UserRole" OWNER TO neondb_owner;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."UserStatus" AS ENUM (
    'active',
    'inactive',
    'blocked',
    'removed'
);


ALTER TYPE public."UserStatus" OWNER TO neondb_owner;

--
-- Name: access_category; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.access_category AS ENUM (
    'CIVIL',
    'OPS',
    'ADM',
    'ROOT'
);


ALTER TYPE public.access_category OWNER TO neondb_owner;

--
-- Name: TYPE access_category; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TYPE public.access_category IS 'Access categories: CIVIL, OPS, ADM, ROOT';


--
-- Name: audit_event_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.audit_event_type AS ENUM (
    'LOGIN',
    'LOGOUT',
    'ACCESS_GRANTED',
    'ACCESS_DENIED',
    'PERMISSION_CHECK',
    'ROLE_CHANGED',
    'MFA_REQUIRED',
    'MFA_VERIFIED',
    'SUSPICIOUS_ACTIVITY',
    'DATA_ACCESS',
    'DATA_MODIFICATION',
    'CONFIG_CHANGE'
);


ALTER TYPE public.audit_event_type OWNER TO neondb_owner;

--
-- Name: priority_level; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.priority_level AS ENUM (
    'critical',
    'high',
    'medium',
    'low'
);


ALTER TYPE public.priority_level OWNER TO neondb_owner;

--
-- Name: requirement_category; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.requirement_category AS ENUM (
    'technical',
    'security',
    'compliance',
    'documentation',
    'testing',
    'business'
);


ALTER TYPE public.requirement_category OWNER TO neondb_owner;

--
-- Name: requirement_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.requirement_status AS ENUM (
    'not_started',
    'in_progress',
    'blocked',
    'completed',
    'waived'
);


ALTER TYPE public.requirement_status OWNER TO neondb_owner;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_role AS ENUM (
    'USER',
    'OPERATOR',
    'ADMIN',
    'ADMIN_MAX'
);


ALTER TYPE public.user_role OWNER TO neondb_owner;

--
-- Name: TYPE user_role; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TYPE public.user_role IS 'RBAC roles: USER (CIVIL), OPERATOR (OPS), ADMIN (ADM), ADMIN_MAX (ROOT)';


--
-- Name: user_status; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.user_status AS ENUM (
    'ACTIVE',
    'SUSPENDED',
    'BLOCKED',
    'PENDING_VERIFICATION'
);


ALTER TYPE public.user_status OWNER TO neondb_owner;

--
-- Name: log_role_change(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.log_role_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO role_history (user_id, old_role, new_role, changed_by, reason)
    VALUES (
      NEW.id,
      OLD.role,
      NEW.role,
      COALESCE(current_setting('app.current_user_id', TRUE), 'system'),
      COALESCE(current_setting('app.role_change_reason', TRUE), 'Manual change')
    );
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_role_change() OWNER TO neondb_owner;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    event_type public.audit_event_type NOT NULL,
    user_id text,
    user_role public.user_role,
    action text NOT NULL,
    resource text,
    resource_id text,
    allowed boolean NOT NULL,
    ip_address text,
    user_agent text,
    session_id text,
    device_id text,
    metadata jsonb DEFAULT '{}'::jsonb,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO neondb_owner;

--
-- Name: TABLE audit_logs; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit trail of all access attempts';


--
-- Name: autopilot_comparisons; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.autopilot_comparisons (
    id text NOT NULL,
    request_id text NOT NULL,
    v7_decision_id text NOT NULL,
    v8_decision_id text NOT NULL,
    action_changed boolean NOT NULL,
    risk_score_delta double precision NOT NULL,
    confidence_delta double precision NOT NULL,
    similarity double precision NOT NULL,
    recommendation text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.autopilot_comparisons OWNER TO neondb_owner;

--
-- Name: autopilot_decisions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.autopilot_decisions (
    id text NOT NULL,
    request_id text NOT NULL,
    version text NOT NULL,
    action_type text NOT NULL,
    recommended_action text NOT NULL,
    risk_level text NOT NULL,
    risk_score double precision NOT NULL,
    confidence double precision NOT NULL,
    reasoning text,
    reasoning_trace jsonb,
    safety_check jsonb,
    human_approval_required boolean DEFAULT false NOT NULL,
    country_code text NOT NULL,
    user_id text NOT NULL,
    processing_time_ms integer NOT NULL,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.autopilot_decisions OWNER TO neondb_owner;

--
-- Name: cases; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cases (
    id text NOT NULL,
    case_number text NOT NULL,
    user_id text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    stage text,
    description text,
    total_delay_days integer DEFAULT 0 NOT NULL,
    breach_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cases OWNER TO neondb_owner;

--
-- Name: circuit_breaker_state; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.circuit_breaker_state (
    id text NOT NULL,
    state text NOT NULL,
    failure_count integer DEFAULT 0 NOT NULL,
    success_count integer DEFAULT 0 NOT NULL,
    last_failure_at timestamp(3) without time zone,
    last_state_change timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.circuit_breaker_state OWNER TO neondb_owner;

--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.feature_flags (
    id text NOT NULL,
    key text NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    rollout_strategy jsonb,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by text
);


ALTER TABLE public.feature_flags OWNER TO neondb_owner;

--
-- Name: launch_checklist_templates; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.launch_checklist_templates (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    name text NOT NULL,
    description text,
    module_category text,
    requirements jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.launch_checklist_templates OWNER TO neondb_owner;

--
-- Name: login_audit; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.login_audit (
    id text NOT NULL,
    user_id text,
    email text NOT NULL,
    success boolean NOT NULL,
    ip_address text NOT NULL,
    user_agent text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.login_audit OWNER TO neondb_owner;

--
-- Name: module_launch_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.module_launch_history (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    module_id text NOT NULL,
    version text,
    launch_type text,
    total_requirements integer,
    completed_requirements integer,
    waived_requirements integer,
    completion_percentage integer,
    launched_by text,
    launched_at timestamp without time zone DEFAULT now(),
    rollback_plan text,
    metadata jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.module_launch_history OWNER TO neondb_owner;

--
-- Name: module_requirements; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.module_requirements (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    module_id text NOT NULL,
    title text NOT NULL,
    description text,
    category public.requirement_category NOT NULL,
    priority public.priority_level DEFAULT 'medium'::public.priority_level NOT NULL,
    status public.requirement_status DEFAULT 'not_started'::public.requirement_status NOT NULL,
    assigned_to text,
    assigned_team text,
    progress_percentage integer DEFAULT 0,
    estimated_hours integer,
    actual_hours integer,
    dependencies text[],
    blocks text[],
    due_date timestamp without time zone,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    blocked_at timestamp without time zone,
    blocked_reason text,
    metadata jsonb DEFAULT '{}'::jsonb,
    acceptance_criteria text[],
    verification_method text,
    created_by text,
    updated_by text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT module_requirements_progress_percentage_check CHECK (((progress_percentage >= 0) AND (progress_percentage <= 100)))
);


ALTER TABLE public.module_requirements OWNER TO neondb_owner;

--
-- Name: TABLE module_requirements; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.module_requirements IS 'Module launch requirements and readiness tracking';


--
-- Name: module_launch_readiness; Type: VIEW; Schema: public; Owner: neondb_owner
--

CREATE VIEW public.module_launch_readiness AS
 SELECT module_id,
    count(*) AS total_requirements,
    count(*) FILTER (WHERE (status = 'completed'::public.requirement_status)) AS completed,
    count(*) FILTER (WHERE (status = 'blocked'::public.requirement_status)) AS blocked,
    count(*) FILTER (WHERE (status = 'in_progress'::public.requirement_status)) AS in_progress,
    count(*) FILTER (WHERE (status = 'waived'::public.requirement_status)) AS waived,
    count(*) FILTER (WHERE ((priority = 'critical'::public.priority_level) AND (status <> 'completed'::public.requirement_status) AND (status <> 'waived'::public.requirement_status))) AS critical_blockers,
    round((((count(*) FILTER (WHERE ((status = 'completed'::public.requirement_status) OR (status = 'waived'::public.requirement_status))))::numeric / (count(*))::numeric) * (100)::numeric)) AS completion_percentage
   FROM public.module_requirements
  GROUP BY module_id;


ALTER VIEW public.module_launch_readiness OWNER TO neondb_owner;

--
-- Name: VIEW module_launch_readiness; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON VIEW public.module_launch_readiness IS 'Real-time launch readiness dashboard';


--
-- Name: role_history; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.role_history (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    user_id text NOT NULL,
    old_role public.user_role,
    new_role public.user_role NOT NULL,
    changed_by text NOT NULL,
    reason text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.role_history OWNER TO neondb_owner;

--
-- Name: TABLE role_history; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.role_history IS 'History of all role changes for compliance';


--
-- Name: security_alerts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.security_alerts (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    user_id text,
    alert_type text NOT NULL,
    severity text NOT NULL,
    description text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    resolved boolean DEFAULT false,
    resolved_at timestamp without time zone,
    resolved_by text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.security_alerts OWNER TO neondb_owner;

--
-- Name: TABLE security_alerts; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.security_alerts IS 'Security incidents and anomaly detections';


--
-- Name: security_dashboard; Type: VIEW; Schema: public; Owner: neondb_owner
--

CREATE VIEW public.security_dashboard AS
 SELECT date_trunc('hour'::text, "timestamp") AS hour,
    event_type,
    count(*) AS event_count,
    count(*) FILTER (WHERE (allowed = false)) AS denied_count,
    count(DISTINCT user_id) AS unique_users
   FROM public.audit_logs
  WHERE ("timestamp" > (now() - '24:00:00'::interval))
  GROUP BY (date_trunc('hour'::text, "timestamp")), event_type
  ORDER BY (date_trunc('hour'::text, "timestamp")) DESC;


ALTER VIEW public.security_dashboard OWNER TO neondb_owner;

--
-- Name: timeline_events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.timeline_events (
    id text NOT NULL,
    case_id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    description text,
    actor text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.timeline_events OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role public.user_role DEFAULT 'USER'::public.user_role NOT NULL,
    category public.access_category DEFAULT 'CIVIL'::public.access_category NOT NULL,
    status public.user_status DEFAULT 'ACTIVE'::public.user_status NOT NULL,
    first_name text,
    last_name text,
    organization text,
    phone text,
    mfa_enabled boolean DEFAULT false,
    mfa_secret text,
    violations integer DEFAULT 0,
    risk_score integer DEFAULT 0,
    inactive_days integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    last_login_at timestamp without time zone,
    password_changed_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.users IS 'Core users table with RBAC roles and access categories';


--
-- Name: user_permissions_summary; Type: VIEW; Schema: public; Owner: neondb_owner
--

CREATE VIEW public.user_permissions_summary AS
 SELECT u.id,
    u.email,
    u.role,
    u.category,
    u.status,
    u.organization,
    count(DISTINCT al.id) FILTER (WHERE (al.allowed = true)) AS granted_access_count,
    count(DISTINCT al.id) FILTER (WHERE (al.allowed = false)) AS denied_access_count,
    max(al."timestamp") AS last_access_attempt,
    u.last_login_at
   FROM (public.users u
     LEFT JOIN public.audit_logs al ON (((al.user_id = u.id) AND (al.event_type = ANY (ARRAY['ACCESS_GRANTED'::public.audit_event_type, 'ACCESS_DENIED'::public.audit_event_type])))))
  GROUP BY u.id, u.email, u.role, u.category, u.status, u.organization, u.last_login_at;


ALTER VIEW public.user_permissions_summary OWNER TO neondb_owner;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_sessions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    user_id text NOT NULL,
    session_token text NOT NULL,
    mfa_verified boolean DEFAULT false,
    ip_address text,
    user_agent text,
    device_id text,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone NOT NULL,
    last_activity_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_sessions OWNER TO neondb_owner;

--
-- Name: TABLE user_sessions; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.user_sessions IS 'Active user sessions with MFA status';


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, event_type, user_id, user_role, action, resource, resource_id, allowed, ip_address, user_agent, session_id, device_id, metadata, "timestamp") FROM stdin;
\.


--
-- Data for Name: autopilot_comparisons; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.autopilot_comparisons (id, request_id, v7_decision_id, v8_decision_id, action_changed, risk_score_delta, confidence_delta, similarity, recommendation, created_at) FROM stdin;
\.


--
-- Data for Name: autopilot_decisions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.autopilot_decisions (id, request_id, version, action_type, recommended_action, risk_level, risk_score, confidence, reasoning, reasoning_trace, safety_check, human_approval_required, country_code, user_id, processing_time_ms, metadata, created_at) FROM stdin;
cmk6411a60000l504dfd7axh3	prod-test-001	7.0.0	BUDGET_ALLOCATION	APPROVE	MEDIUM	0.5	0.85	v7: Legacy decision logic	\N	\N	f	US	prod-user-123	0	\N	2026-01-09 00:00:20.67
\.


--
-- Data for Name: cases; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cases (id, case_number, user_id, status, stage, description, total_delay_days, breach_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: circuit_breaker_state; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.circuit_breaker_state (id, state, failure_count, success_count, last_failure_at, last_state_change, created_at, updated_at) FROM stdin;
cmk63k2pb0001pb5oyvlztrof	CLOSED	0	0	\N	2026-01-08 23:47:09.359	2026-01-08 23:47:09.359	2026-01-08 23:47:09.359
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.feature_flags (id, key, enabled, rollout_strategy, metadata, created_at, updated_at, created_by) FROM stdin;
cmk63k22v0000pb5own6rvbae	HBS_AUTOPILOT_V8	f	{"type": "PERCENTAGE", "percentage": 0}	\N	2026-01-08 23:47:08.551	2026-01-08 23:47:08.551	system
\.


--
-- Data for Name: launch_checklist_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.launch_checklist_templates (id, name, description, module_category, requirements, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: login_audit; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.login_audit (id, user_id, email, success, ip_address, user_agent, "timestamp") FROM stdin;
\.


--
-- Data for Name: module_launch_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.module_launch_history (id, module_id, version, launch_type, total_requirements, completed_requirements, waived_requirements, completion_percentage, launched_by, launched_at, rollback_plan, metadata) FROM stdin;
\.


--
-- Data for Name: module_requirements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.module_requirements (id, module_id, title, description, category, priority, status, assigned_to, assigned_team, progress_percentage, estimated_hours, actual_hours, dependencies, blocks, due_date, started_at, completed_at, blocked_at, blocked_reason, metadata, acceptance_criteria, verification_method, created_by, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.role_history (id, user_id, old_role, new_role, changed_by, reason, created_at) FROM stdin;
\.


--
-- Data for Name: security_alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.security_alerts (id, user_id, alert_type, severity, description, metadata, resolved, resolved_at, resolved_by, created_at) FROM stdin;
\.


--
-- Data for Name: timeline_events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.timeline_events (id, case_id, type, title, description, actor, "timestamp") FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_sessions (id, user_id, session_token, mfa_verified, ip_address, user_agent, device_id, created_at, expires_at, last_activity_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, password_hash, role, category, status, first_name, last_name, organization, phone, mfa_enabled, mfa_secret, violations, risk_score, inactive_days, metadata, created_at, updated_at, last_login_at, password_changed_at) FROM stdin;
8cfd8c14-2c96-4c35-81d5-d5d5b1dd732a	admin@ivyar.org	$2b$10$R0R2NQ1.t7sosNbSiT6nRu6/39daY3bfI6itg5fDDPakf2NHz0G/W	ADMIN_MAX	ROOT	ACTIVE	Root	Administrator	IVYAR Government	\N	t	\N	0	0	0	{}	2026-01-09 16:04:01.703184	2026-01-09 16:04:01.703184	\N	\N
8e81fa29-b4a7-4f4c-a7bf-8fb307f35031	manager@ivyar.org	$2b$10$/YX8Y1oIwg4jwEHp8nogp.7zVaD.YA0oxYokPR6ALUbDr1.nM1WGe	ADMIN	ADM	ACTIVE	System	Administrator	IVYAR Operations	\N	t	\N	0	0	0	{}	2026-01-09 16:04:01.872082	2026-01-09 16:04:01.872082	\N	\N
d7627c7a-300e-4fd4-a7e8-7cc0ac439aab	operator@ivyar.org	$2b$10$Ej7AY1eWQaEW5wMXTnpAvOrnx9W2dOnuTc/B0rYqiEk9QBKCQF.US	OPERATOR	OPS	ACTIVE	Claims	Processor	IVYAR Operations	\N	t	\N	0	0	0	{}	2026-01-09 16:04:02.026371	2026-01-09 16:04:02.026371	\N	\N
769d60d5-ea17-4ee8-9de3-30f2312cb13a	user@ivyar.org	$2b$10$Zilqy0UFsB.alSA1YCHGyu.hU0IK7vakTIkGGrdJynXNcNCco4bBa	USER	CIVIL	ACTIVE	John	Citizen	Public	\N	f	\N	0	0	0	{}	2026-01-09 16:04:02.175972	2026-01-09 16:04:02.175972	\N	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: autopilot_comparisons autopilot_comparisons_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.autopilot_comparisons
    ADD CONSTRAINT autopilot_comparisons_pkey PRIMARY KEY (id);


--
-- Name: autopilot_decisions autopilot_decisions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.autopilot_decisions
    ADD CONSTRAINT autopilot_decisions_pkey PRIMARY KEY (id);


--
-- Name: cases cases_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (id);


--
-- Name: circuit_breaker_state circuit_breaker_state_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.circuit_breaker_state
    ADD CONSTRAINT circuit_breaker_state_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: launch_checklist_templates launch_checklist_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.launch_checklist_templates
    ADD CONSTRAINT launch_checklist_templates_pkey PRIMARY KEY (id);


--
-- Name: login_audit login_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.login_audit
    ADD CONSTRAINT login_audit_pkey PRIMARY KEY (id);


--
-- Name: module_launch_history module_launch_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_launch_history
    ADD CONSTRAINT module_launch_history_pkey PRIMARY KEY (id);


--
-- Name: module_requirements module_requirements_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_requirements
    ADD CONSTRAINT module_requirements_pkey PRIMARY KEY (id);


--
-- Name: role_history role_history_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.role_history
    ADD CONSTRAINT role_history_pkey PRIMARY KEY (id);


--
-- Name: security_alerts security_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.security_alerts
    ADD CONSTRAINT security_alerts_pkey PRIMARY KEY (id);


--
-- Name: timeline_events timeline_events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_token_key UNIQUE (session_token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: autopilot_comparisons_created_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX autopilot_comparisons_created_at_idx ON public.autopilot_comparisons USING btree (created_at);


--
-- Name: autopilot_comparisons_similarity_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX autopilot_comparisons_similarity_idx ON public.autopilot_comparisons USING btree (similarity);


--
-- Name: autopilot_decisions_action_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX autopilot_decisions_action_type_idx ON public.autopilot_decisions USING btree (action_type);


--
-- Name: autopilot_decisions_country_code_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX autopilot_decisions_country_code_idx ON public.autopilot_decisions USING btree (country_code);


--
-- Name: autopilot_decisions_created_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX autopilot_decisions_created_at_idx ON public.autopilot_decisions USING btree (created_at);


--
-- Name: autopilot_decisions_request_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX autopilot_decisions_request_id_key ON public.autopilot_decisions USING btree (request_id);


--
-- Name: autopilot_decisions_version_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX autopilot_decisions_version_idx ON public.autopilot_decisions USING btree (version);


--
-- Name: cases_case_number_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX cases_case_number_idx ON public.cases USING btree (case_number);


--
-- Name: cases_case_number_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX cases_case_number_key ON public.cases USING btree (case_number);


--
-- Name: cases_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX cases_user_id_idx ON public.cases USING btree (user_id);


--
-- Name: feature_flags_enabled_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX feature_flags_enabled_idx ON public.feature_flags USING btree (enabled);


--
-- Name: feature_flags_key_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX feature_flags_key_idx ON public.feature_flags USING btree (key);


--
-- Name: feature_flags_key_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX feature_flags_key_key ON public.feature_flags USING btree (key);


--
-- Name: idx_audit_logs_allowed; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_logs_allowed ON public.audit_logs USING btree (allowed);


--
-- Name: idx_audit_logs_event_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_logs_event_type ON public.audit_logs USING btree (event_type);


--
-- Name: idx_audit_logs_timestamp; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs USING btree ("timestamp" DESC);


--
-- Name: idx_audit_logs_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_module_requirements_assigned; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_module_requirements_assigned ON public.module_requirements USING btree (assigned_to);


--
-- Name: idx_module_requirements_category; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_module_requirements_category ON public.module_requirements USING btree (category);


--
-- Name: idx_module_requirements_due_date; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_module_requirements_due_date ON public.module_requirements USING btree (due_date);


--
-- Name: idx_module_requirements_module; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_module_requirements_module ON public.module_requirements USING btree (module_id);


--
-- Name: idx_module_requirements_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_module_requirements_status ON public.module_requirements USING btree (status);


--
-- Name: idx_security_alerts_resolved; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_security_alerts_resolved ON public.security_alerts USING btree (resolved);


--
-- Name: idx_security_alerts_severity; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_security_alerts_severity ON public.security_alerts USING btree (severity);


--
-- Name: idx_security_alerts_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_security_alerts_user_id ON public.security_alerts USING btree (user_id);


--
-- Name: idx_sessions_expires_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_expires_at ON public.user_sessions USING btree (expires_at);


--
-- Name: idx_sessions_token; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_token ON public.user_sessions USING btree (session_token);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_users_category; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_category ON public.users USING btree (category);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_organization; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_organization ON public.users USING btree (organization);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: login_audit_email_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX login_audit_email_idx ON public.login_audit USING btree (email);


--
-- Name: login_audit_timestamp_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX login_audit_timestamp_idx ON public.login_audit USING btree ("timestamp");


--
-- Name: timeline_events_case_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX timeline_events_case_id_idx ON public.timeline_events USING btree (case_id);


--
-- Name: users log_user_role_change; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER log_user_role_change AFTER UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.log_role_change();


--
-- Name: module_requirements update_module_requirements_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_module_requirements_updated_at BEFORE UPDATE ON public.module_requirements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: neondb_owner
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: role_history role_history_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.role_history
    ADD CONSTRAINT role_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: role_history role_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.role_history
    ADD CONSTRAINT role_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: security_alerts security_alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.security_alerts
    ADD CONSTRAINT security_alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: timeline_events timeline_events_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.timeline_events
    ADD CONSTRAINT timeline_events_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict VRXlbRFEdF864fbwbdlRs5ixR2GugkDVLlOOGmzxyL700K7wCznO2XlW6bEEVGT

