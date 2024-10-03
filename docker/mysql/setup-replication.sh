#!/bin/bash

# Wait for MySQL master to be ready
until docker exec mysql-m mysql -uroot -proot -e "SHOW MASTER STATUS;" > /dev/null 2>&1; do
  echo "Waiting for MySQL master to be ready..."
  sleep 5
done

# Get master log file and position
MASTER_STATUS=$(docker exec mysql-m mysql -uroot -proot -e "SHOW MASTER STATUS\G")
MASTER_LOG_FILE=$(echo "$MASTER_STATUS" | grep File | awk '{print $2}')
MASTER_LOG_POS=$(echo "$MASTER_STATUS" | grep Position | awk '{print $2}')

echo "Master Log File: $MASTER_LOG_FILE"
echo "Master Log Position: $MASTER_LOG_POS"

# Configure replication for mysql-s1 (slave 1)
docker exec mysql-s1 mysql -uroot -proot -e "STOP SLAVE;"
docker exec mysql-s1 mysql -uroot -proot -e "CHANGE MASTER TO MASTER_HOST='mysql-m', MASTER_USER='replica_user', MASTER_PASSWORD='replica_password', MASTER_LOG_FILE='$MASTER_LOG_FILE', MASTER_LOG_POS=$MASTER_LOG_POS;"
docker exec mysql-s1 mysql -uroot -proot -e "START SLAVE;"

# Configure replication for mysql-s2 (slave 2)
docker exec mysql-s2 mysql -uroot -proot -e "STOP SLAVE;"
docker exec mysql-s2 mysql -uroot -proot -e "CHANGE MASTER TO MASTER_HOST='mysql-m', MASTER_USER='replica_user', MASTER_PASSWORD='replica_password', MASTER_LOG_FILE='$MASTER_LOG_FILE', MASTER_LOG_POS=$MASTER_LOG_POS;"
docker exec mysql-s2 mysql -uroot -proot -e "START SLAVE;"

# Verify replication status for mysql-s1
docker exec mysql-s1 mysql -uroot -proot -e "SHOW SLAVE STATUS\G"

# Verify replication status for mysql-s2
docker exec mysql-s2 mysql -uroot -proot -e "SHOW SLAVE STATUS\G"