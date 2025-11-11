#!/bin/bash
# SSH Tunnel to access OVH MySQL database locally
# This creates a tunnel so you can connect to the OVH database from your local machine

echo "Setting up SSH tunnel to OVH MySQL database..."
echo "This will forward local port 3306 to OVH MySQL server"
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo ""

# Create SSH tunnel
# -L 3306:elektry2025.mysql.db:3306 forwards local port 3306 to OVH MySQL
# -N means don't execute remote commands
# -f means run in background
ssh -L 3306:elektry2025.mysql.db:3306 \
    -N \
    elektry@ftp.cluster129.hosting.ovh.net

echo "SSH tunnel established!"
echo "You can now connect to the database using:"
echo "  Host: 127.0.0.1"
echo "  Port: 3306"
echo "  Database: elektry2025"
echo "  Username: elektry2025"
echo "  Password: 92Alcolea2025"

