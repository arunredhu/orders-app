# Start docker 
echo 'Starting docker'
sudo docker-compose up -d

echo 'Installing dependencies...'
sleep 150

# Start Test Cases
# echo 'Integration test cases:'
# docker exec -it transport_apis_server_1 npm test test/integrationTest.js

# echo 'Unit test cases:'
# docker exec -it transport_apis_server_1 npm test test/unitTest.js

exit 0