# Use an official Python runtime as a parent image
FROM python
# Set the working directory to /app
WORKDIR /app

# Install pipenv
RUN pip install pipenv

# Copy the Pipfile and Pipfile.lock to the container
COPY Pipfile Pipfile.lock ./

# Install dependencies
RUN pipenv install --system --deploy 

# Copy the rest of the application files to the container
COPY . .

# Expose the port that the application will listen on
EXPOSE 5010

# Activate the virtual environment and start the application
CMD ["/bin/bash", "-c", "source /opt/venv/bin/activate && python app.py"]
