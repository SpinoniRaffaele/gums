FROM maven as maven-builder

COPY . .

RUN mvn clean install -DskipTests

FROM tomcat

ENV MONGO_HOST=mongo

COPY --from=maven-builder target/*.war /usr/local/tomcat/webapps/

EXPOSE 8080

CMD ["catalina.sh", "run"]