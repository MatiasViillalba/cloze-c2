-- Cloze C2 — cloud sync schema.
--
-- Paste the whole file into the Supabase SQL editor and run it once. It is
-- idempotent: running it again after an update is safe.
--
-- Threat model in one line: the anon key ships inside the app, so the key alone
-- must be worth nothing. The table therefore grants nothing to anon at all, and
-- the only two things anon may call are the functions below — both of which
-- demand the 16-character sync code that never leaves your devices.

create table if not exists public.sync_state (
  code       text primary key,
  payload    jsonb       not null,
  rev        bigint      not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS on with zero policies: PostgREST can see the table but no row ever
-- matches, which is the belt to the "revoke" braces below.
alter table public.sync_state enable row level security;
revoke all on public.sync_state from anon, authenticated;

-- ---------------------------------------------------------------- pull ---
-- Returns { rev, payload }. An unknown code is not an error: it is simply a
-- device that has not uploaded anything yet, so it gets rev 0 and no payload.

create or replace function public.sync_pull(p_code text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select jsonb_build_object('rev', s.rev, 'payload', s.payload)
       from public.sync_state s
      where s.code = p_code),
    jsonb_build_object('rev', 0, 'payload', null)
  );
$$;

-- ---------------------------------------------------------------- push ---
-- Optimistic concurrency: the caller sends the rev it last saw. If the row has
-- moved on since, nothing is written and { conflict: true } comes back, which
-- tells the client to pull, merge again and retry. Two phones studying at the
-- same time therefore cannot silently overwrite one another.

create or replace function public.sync_push(p_code text, p_payload jsonb, p_rev bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rev bigint;
begin
  if p_code is null or length(p_code) < 12 or length(p_code) > 64 then
    raise exception 'invalid sync code';
  end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'invalid payload';
  end if;
  if pg_column_size(p_payload) > 4000000 then
    raise exception 'payload too large';
  end if;

  update public.sync_state
     set payload = p_payload,
         rev = rev + 1,
         updated_at = now()
   where code = p_code
     and rev = p_rev
  returning rev into v_rev;

  if v_rev is not null then
    return jsonb_build_object('rev', v_rev, 'conflict', false);
  end if;

  -- No row updated. Either this code is brand new, or somebody else pushed.
  if p_rev = 0 then
    insert into public.sync_state (code, payload, rev)
    values (p_code, p_payload, 1)
    on conflict (code) do nothing
    returning rev into v_rev;

    if v_rev is not null then
      return jsonb_build_object('rev', v_rev, 'conflict', false);
    end if;
  end if;

  select rev into v_rev from public.sync_state where code = p_code;
  return jsonb_build_object('rev', coalesce(v_rev, 0), 'conflict', true);
end;
$$;

-- Only these two doors, and only for the anonymous role the app uses.
revoke all on function public.sync_pull(text) from public;
revoke all on function public.sync_push(text, jsonb, bigint) from public;
grant execute on function public.sync_pull(text) to anon;
grant execute on function public.sync_push(text, jsonb, bigint) to anon;
