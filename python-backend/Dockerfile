FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
EXPOSE 9000
ENTRYPOINT ["/app/entrypoint.sh"]


#CMD ["python3", "manage.py", "runserver", "0.0.0.0:9000"]

