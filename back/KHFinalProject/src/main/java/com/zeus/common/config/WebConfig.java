package com.zeus.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    public static final String ALLOWED_METHOD_NAMES = "GET,HEAD,POST,PUT,DELETE,TRACE,OPTIONS,PATCH";

    @Override
    public void addCorsMappings(final CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:5173") // ✅ 특정 도메인만 허용
                .allowedMethods(ALLOWED_METHOD_NAMES.split(","))
                .allowCredentials(true) // ✅ 쿠키 포함 요청 허용
                .allowedHeaders("*")
                .exposedHeaders("Authorization"); // ✅ JWT가 담긴 Authorization 헤더 노출
    }
}