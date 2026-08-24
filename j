#!/bin/sh
# Run a Java drill from anywhere.
#   ./j J6Sql            ../j J6Sql example        ~/…/drills/j J6Steps
dir=$(cd "$(dirname "$0")" && pwd)
name=$1
[ -z "$name" ] && { echo "usage: j <DrillName> [args]"; exit 1; }
shift
exec java -cp "$dir/lib/h2.jar" "$dir/java-1-storage/$name.java" "$@"
