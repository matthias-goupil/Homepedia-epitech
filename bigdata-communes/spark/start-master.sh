#!/bin/bash
/opt/spark/sbin/start-master.sh
export PATH=$PATH:/opt/spark/bin
tail -f /dev/null