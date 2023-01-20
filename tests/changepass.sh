curl -i -X POST http://localhost:8080/change_password \
  -H 'Content-Type: application/json' \
  -H @token.txt \
  -d @body3.json
