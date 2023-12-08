package com.rspinoni.gums.security;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.http.MediaType;
import org.springframework.web.filter.GenericFilterBean;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rspinoni.gums.model.exception.ErrorMessage;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ApiKeyFilter extends GenericFilterBean {

  private final String apyKeyHeader;

  private final String apiKey;

  private final ObjectMapper mapper = new ObjectMapper();


  public ApiKeyFilter(String apiKey, String apiKeyHeader) {
    this.apyKeyHeader = apiKeyHeader;
    this.apiKey = apiKey;
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    String key = ((HttpServletRequest) request).getHeader(apyKeyHeader);
    if (!apiKey.equals(key)) {
      HttpServletResponse httpResponse = (HttpServletResponse) response;
      httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      httpResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
      PrintWriter writer = httpResponse.getWriter();
      writer.print(mapper.writeValueAsString(new ErrorMessage("Invalid API Key")));
      writer.flush();
      writer.close();
    } else {
      chain.doFilter(request, response);
    }
  }
}
