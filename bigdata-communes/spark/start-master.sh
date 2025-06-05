#!/bin/bash
/opt/spark/sbin/start-master.sh
export PATH=/opt/spark/bin:$PATH
tail -f /dev/null