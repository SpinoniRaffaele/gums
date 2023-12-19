FROM maven as maven-builder

COPY . .

RUN mvn clean install -DskipTests

FROM tomcat

ENV GUMS_API_KEY=test

COPY --from=maven-builder target/*.war /usr/local/tomcat/webapps/

EXPOSE 8080

CMD ["catalina.sh", "run"]