# Stage 1: Node.js environment for building the project
FROM node:18.18.2 as node-build

# Install Gradle
RUN apt-get update && apt-get install -y gradle

# Set working directory
WORKDIR /app

# Copy the project files
COPY . .

# Install Node.js dependencies
RUN npm install

# Build the Java project with Gradle
RUN gradle build

# Stage 2: Final runtime environment
FROM alpine:3.19

ARG version=17.0.11.9.1

# Install Amazon Corretto JDK
RUN wget -O /THIRD-PARTY-LICENSES-20200824.tar.gz https://corretto.aws/downloads/resources/licenses/alpine/THIRD-PARTY-LICENSES-20200824.tar.gz && \
    echo "82f3e50e71b2aee21321b2b33de372feed5befad6ef2196ddec92311bc09becb  /THIRD-PARTY-LICENSES-20200824.tar.gz" | sha256sum -c - && \
    tar x -ovzf THIRD-PARTY-LICENSES-20200824.tar.gz && \
    rm -rf THIRD-PARTY-LICENSES-20200824.tar.gz && \
    wget -O /etc/apk/keys/amazoncorretto.rsa.pub https://apk.corretto.aws/amazoncorretto.rsa.pub && \
    SHA_SUM="6cfdf08be09f32ca298e2d5bd4a359ee2b275765c09b56d514624bf831eafb91" && \
    echo "${SHA_SUM}  /etc/apk/keys/amazoncorretto.rsa.pub" | sha256sum -c - && \
    echo "https://apk.corretto.aws" >> /etc/apk/repositories && \
    apk add --no-cache amazon-corretto-17=$version-r0 && \
    rm -rf /usr/lib/jvm/java-17-amazon-corretto/lib/src.zip

# Set environment variables for Java
ENV LANG C.UTF-8
ENV JAVA_HOME=/usr/lib/jvm/default-jvm
ENV PATH=$PATH:/usr/lib/jvm/default-jvm/bin

# Copy the built JAR file from the build stage
COPY --from=node-build /app/build/libs/customer-data-api-1.0-SNAPSHOT-all.jar /home/customer-data-api-1.0-SNAPSHOT-all.jar

# Command to run the application
CMD ["java", "-jar", "/home/customer-data-api-1.0-SNAPSHOT-all.jar"]