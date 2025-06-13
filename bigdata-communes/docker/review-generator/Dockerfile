FROM python:3.10-slim

WORKDIR /app
COPY next-app/src/mock/mockCities.json .
COPY bigdata-communes/docker/review-generator/review_server.py .
COPY bigdata-communes/docker/review-generator/requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "review_server.py"]