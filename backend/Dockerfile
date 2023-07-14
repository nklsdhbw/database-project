# Use an official Python runtime as a parent image
FROM python
# Set the working directory to /app
WORKDIR /app

# copy requirements.txt to the container
COPY requirements.txt .

# Install required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files to the container
COPY . .

# Expose the port that the application will listen on
EXPOSE 5010

# Activate the virtual environment and start the application
CMD ["python", "app.py"]
