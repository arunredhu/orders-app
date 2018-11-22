# Start docker 
echo 'Starting docker'
sudo docker-compose up -d

echo 'Installing dependencies...'
sleep 150

Start Test Cases
echo 'Integration test cases:'
docker exec -it app npm run e2e

echo 'Unit test cases:'
docker exec -it app npm test

exit 0