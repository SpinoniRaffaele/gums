package com.rspinoni.gums.model;

import lombok.Builder;

@Builder
public record Credentials(String name, String password) {
}
