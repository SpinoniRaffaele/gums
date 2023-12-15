FROM tomcat

ENV GUMS_API_KEY=test

COPY target/*.war /usr/local/tomcat/webapps/

EXPOSE 8080

CMD ["catalina.sh", "run"]
