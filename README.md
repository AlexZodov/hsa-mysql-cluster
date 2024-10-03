# hsa-mysql-cluster

# Task
- Create 3 docker containers: mysql-m, mysql-s1, mysql-s2
- Setup master slave replication (Master: mysql-m, Slave: mysql-s1, mysql-s2)
- Write script that will frequently write data to database.
- Ensure, that replication is working.
- Try to turn off mysql-s1 (stop slave).
- Try to remove a column in  database on slave node (try to delete last column and column from the middle).
- Write conclusion in readme.md

# How to start
1. Clone the repo to local machine
2. Head to `./server` on local machine and run `npm install` (required once to create node_modules folder before it will be projected to inner docker container filesystem)
3. Head to root of the cloned repo
4. Run `docker-compose up -d`
5. After all containers are up and running
   1. Run shell script on host machine in project dir `./docker/mysql/setup-replication.sh` (observe output, it can wait for master node to be fully started)
   2. Create terminal to container with server and run `npx typeorm-ts-node-commonjs migration:run -d ./src/database/config/ormconfig.ts` to execute migration and create basic table

# How to test
1. Connect via DB editor of your choice or use cli commands via docker and observe DB `hsa`, table `users` on each of nodes (master & slaves)
   1. Records should be continuously inserting into master node and replicating to slaves (server app execute records inserting after startup)
2. Step 1
   1. stop one slave from replicating - run in terminal command `docker exec mysql-s1 mysql -uroot -proot -e "STOP SLAVE;"`
   2. via DB editor (or cli command) - remove column `some_value` (tail column in `user` table), 
      1. if you struggle error "Mysql in read-only mode" - execute command `docker exec mysql-s1 mysql -uroot -proot -e "SET GLOBAL read_only = OFF;"` 
   3. re-start replication for selected slave - run in terminal command `docker exec mysql-s1 mysql -uroot -proot -e "START SLAVE;"`
   4. observe values in table on this slave and request its count
   5. Results: tail column was removed and new records adding successfully
3. Step 2
   1. stop the slave from replicating
   2. remove column `name` (in the middle of column list)
   3. re-start replication
   4. observe container logs from this slave
   5. Results: mysql error - consistency failure

```
 [Warning] [MY-010897] [Repl] Storing MySQL user name or password information in the connection metadata repository is not secure and is therefore not recommended. Please consider using the USER and PASSWORD connection options for START REPLICA; see the 'START REPLICA Syntax' in the MySQL Manual for more information.
 [System] [MY-014001] [Repl] Replica receiver thread for channel '': connected to source 'replica_user@mysql-m:3306' with server_uuid=76819f29-8190-11ef-9a63-0242ac140002, server_id=1. Starting replication from file 'mysql-bin.000003', position '159390406'.
 [Warning] [MY-010584] [Repl] Replica SQL for channel '': Coordinator thread of multi-threaded replica is being stopped in the middle of assigning a group of events; deferring to exit until the group completion ... , Error_code: MY-000000
 [ERROR] [MY-010586] [Repl] Error running query, replica SQL thread aborted. Fix the problem, and restart the replica SQL thread with "START REPLICA". We stopped at log 'mysql-bin.000003' position 199237675
 [Warning] [MY-010897] [Repl] Storing MySQL user name or password information in the connection metadata repository is not secure and is therefore not recommended. Please consider using the USER and PASSWORD connection options for START REPLICA; see the 'START REPLICA Syntax' in the MySQL Manual for more information.
 [System] [MY-014001] [Repl] Replica receiver thread for channel '': connected to source 'replica_user@mysql-m:3306' with server_uuid=76819f29-8190-11ef-9a63-0242ac140002, server_id=1. Starting replication from file 'mysql-bin.000003', position '258749830'.
 [ERROR] [MY-013146] [Repl] Replica SQL for channel '': Worker 1 failed executing transaction 'ANONYMOUS' at source log , end_log_pos 199246073; Column 1 of table 'hsa.user' cannot be converted from type 'varchar(400(bytes))' to type 'date', Error_code: MY-013146
 [Warning] [MY-010584] [Repl] Replica SQL for channel '': ... The replica coordinator and worker threads are stopped, possibly leaving data in inconsistent state. A restart should restore consistency automatically, although using non-transactional storage for data or info tables or DDL queries could lead to problems. In such cases you have to examine your data (see documentation for details). Error_code: MY-001756
