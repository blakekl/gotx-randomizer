#!/bin/bash
# Create SQLite DB Schema
echo "
-- DROP TABLE IF EXISTS [public.completions];
-- DROP TABLE IF EXISTS [public.games];
-- DROP TABLE IF EXISTS [public.nominations];
-- DROP TABLE IF EXISTS [public.themes];
-- DROP TABLE IF EXISTS [public.users];
DROP TABLE IF EXISTS [public.streaks];
--
-- CREATE TABLE [public.completions] ( 
--   [id] INTEGER NOT NULL,
--   [completed_at] datetime NOT NULL,
--   [nomination_id] INTEGER NOT NULL,
--   [user_id] INTEGER NOT NULL,
--   [created_at] TEXT NOT NULL,
--   [updated_at] TEXT NOT NULL
-- );
--
-- CREATE TABLE [public.games] ( 
--   [id] INTEGER NOT NULL,
--   [title_usa] TEXT NULL,
--   [title_eu] TEXT NULL,
--   [title_jap] TEXT NULL,
--   [title_world] TEXT NULL,
--   [title_other] TEXT NULL,
--   [year] INTEGER NOT NULL,
--   [system] TEXT NOT NULL,
--   [developer] TEXT NULL,
--   [genre] TEXT NOT NULL,
--   [img_url] TEXT NULL,
--   [time_to_beat] REAL NULL,
--   [screenscraper_id] INTEGER NULL,
--   [created_at] TEXT NOT NULL,
--   [updated_at] TEXT NOT NULL
-- );
--
-- CREATE TABLE [public.nominations] ( 
--   [id] INTEGER NOT NULL,
--   [nomination_type] INTEGER NOT NULL DEFAULT 0 ,
--   [description] TEXT NULL,
--   [winner] INTEGER NULL DEFAULT 0 ,
--   [game_id] INTEGER NOT NULL,
--   [user_id] INTEGER NULL,
--   [theme_id] INTEGER NULL DEFAULT 0 ,
--   [created_at] TEXT NOT NULL,
--   [updated_at] TEXT NOT NULL
-- );
--
CREATE TABLE [public.streaks] (
  [id] INTEGER NOT NULL,
  [user_id] INTEGER NOT NULL,
  [start_date] TEXT NOT NULL,
  [end_date] TEXT NULL,
  [last_incremented] TEXT NOT NULL,
  [streak_count] TEXT NOT NULL,
  [created_at] TEXT NOT NULL,
  [updated_at] TEXT NOT NULL
);

-- CREATE TABLE [public.themes] ( 
--   [id] INTEGER NOT NULL,
--   [creation_date] TEXT NOT NULL,
--   [title] TEXT NOT NULL,
--   [description] TEXT NULL,
--   [created_at] TEXT NOT NULL,
--   [updated_at] TEXT NOT NULL,
--   [nomination_type] TEXT NOT NULL
-- );
--
-- CREATE TABLE [public.users] ( 
--   [id] INTEGER NOT NULL,
--   [name] TEXT NULL,
--   [discord_id] TEXT NULL,
--   [old_discord_name] TEXT NULL,
--   [current_points] REAL NULL DEFAULT 0 ,
--   [redeemed_points] REAL NOT NULL DEFAULT 0 ,
--   [earned_points] REAL NOT NULL DEFAULT 0,
--   [premium_points] REAL NOT NULL DEFAULT 0,
--   [created_at] TEXT NOT NULL,
--   [updated_at] TEXT NOT NULL,
--   [premium_subscriber] TEXT NULL
-- );
" > $DUMP_PATH

# Download postgres dump
ssh -C $SERVER_NAME@$SERVER_HOST -p $PORT  pg_dump --data-only --inserts -U $DB_USER -h localhost $DATABASE >> $DUMP_PATH

# Replace invaled sqlite statements.
sed -i 's/INTO public.completions/INTO [public.completions]/' dump.sql
sed -i 's/INTO public.games/INTO [public.games]/' dump.sql
sed -i 's/INTO public.nominations/INTO [public.nominations]/' dump.sql
sed -i 's/INTO public.streaks/INTO [public.streaks]/' dump.sql
sed -i 's/INTO public.themes/INTO [public.themes]/' dump.sql
sed -i 's/INTO public.users/INTO [public.users]/' dump.sql
sed -i 's/id bigint NOT NULL/id integer primary key autoincrement/' dump.sql
sed -i 's/bigint/int/' dump.sql
sed -i 's/, true,/, 1,/' dump.sql 
sed -i 's/, false,/, 0,/' dump.sql

# DELETE postgres specific goo.
sed -i '/^--/d' dump.sql
sed -i '/public.schema_migrations/d' dump.sql
sed -i '/SELECT pg_catalog/d' dump.sql
sed -i '/INSERT INTO public.ar_internal_metadata/d' dump.sql
sed -i '/^SET/d' dump.sql
sed -i '/^SELECT pg_catalog.setval/d' dump.sql 