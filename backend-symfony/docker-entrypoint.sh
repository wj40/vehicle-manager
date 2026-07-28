#!/bin/sh
set -e

for f in /run/secrets/*; do
    [ -f "$f" ] || continue
    name=$(basename "$f")
    val=$(tr -d '\n\r' < "$f")
    [ -n "$val" ] || continue
    export "$name"="$val"
done

exec "$@"