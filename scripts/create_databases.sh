echo "SELECT 'CREATE DATABASE auth' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auth')\gexec" | psql postgres -h localhost -p 5432 --username admin
echo "SELECT 'CREATE DATABASE marketplace' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'marketplace')\gexec" | psql postgres -h localhost -p 5432 --username admin
echo "SELECT 'CREATE DATABASE catalog' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'catalog')\gexec" | psql postgres -h localhost -p 5432 --username admin
echo "SELECT 'CREATE DATABASE wallet' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'wallet')\gexec" | psql postgres -h localhost -p 5432 --username admin
echo "SELECT 'CREATE DATABASE shipping' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'shipping')\gexec" | psql postgres -h localhost -p 5432 --username admin
echo "SELECT 'CREATE DATABASE auction_daemon' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auction_daemon')\gexec" | psql postgres -h localhost -p 5432 --username admin
