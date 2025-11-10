package com.sbsurvey.app.web.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.Set;

@Value
@Builder
public class UserDto {
    Long id;
    String username;
    String email;
    Instant createdAt;
    Set<String> roles;
}
