#!/bin/bash
# Download postgres dump
ssh -C $SERVER_NAME@$SERVER_HOST -p $PORT  pg_dump --data-only --inserts -U $DB_USER -h localhost $DATABASE >> $DUMP_PATH

# Replace invaled sqlite statements.
#sed -i 's/INTO public.completions/INTO [public.completions]/' $DUMP_PATH
#sed -i 's/INTO public.games/INTO [public.games]/' $DUMP_PATH
#sed -i 's/INTO public.nominations/INTO [public.nominations]/' $DUMP_PATH
#sed -i 's/INTO public.streaks/INTO [public.streaks]/' $DUMP_PATH
#sed -i 's/INTO public.themes/INTO [public.themes]/' $DUMP_PATH
#sed -i 's/INTO public.users/INTO [public.users]/' $DUMP_PATH
#sed -i 's/id bigint NOT NULL/id integer primary key autoincrement/' $DUMP_PATH
#sed -i 's/bigint/int/' $DUMP_PATH
#sed -i 's/, true,/, 1,/' $DUMP_PATH 
#sed -i 's/, false,/, 0,/' $DUMP_PATH

# DELETE postgres specific goo.
#sed -i '/^--/d' $DUMP_PATH
#sed -i '/public.schema_migrations/d' $DUMP_PATH
#sed -i '/SELECT pg_catalog/d' $DUMP_PATH
#sed -i '/INSERT INTO public.ar_internal_metadata/d' $DUMP_PATH
#sed -i '/^SET/d' $DUMP_PATH
#sed -i '/^SELECT pg_catalog.setval/d' $DUMP_PATH 
