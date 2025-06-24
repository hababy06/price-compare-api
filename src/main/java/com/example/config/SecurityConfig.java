package com.example.config;

import com.example.security.JwtAuthFilter;
import com.example.handler.CustomAccessDeniedHandler;
import com.example.handler.OAuth2SuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.AuthenticationEntryPoint;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Autowired
    private OAuth2SuccessHandler oauth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors()
            .and()
            .csrf().disable()
            .exceptionHandling(e -> e
                .accessDeniedHandler(customAccessDeniedHandler)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/api/report-error/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/report-error/**").authenticated()
                .requestMatchers(
                    "/api/auth/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()
                .requestMatchers(
                    "/api/products/search",
                    "/api/products/*",
                    "/api/price-info/*/prices",
                    "/api/price-info/*/prices/sorted-by-price",
                    "/api/promotion-info/*/promotions",
                    "/api/promotion-info/*/promotions/sorted-by-price",
                    "/api/stores",
                    "/api/promotion-likes/*/count",
                    "/api/price-dislikes/*/count",
                    "/api/price-likes/*/count",
                    "/api/promotion-dislikes/*/count",
                    "/api/price-likes/*/has-liked",
                    "/api/price-dislikes/*/has-disliked",
                    "/api/promotion-likes/*/has-liked",
                    "/api/promotion-dislikes/*/has-disliked"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2SuccessHandler)
            );

        http.exceptionHandling()
            .defaultAuthenticationEntryPointFor(
                (request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\"}");
                },
                new AntPathRequestMatcher("/api/**")
            )
            .defaultAuthenticationEntryPointFor(
                (request, response, authException) -> {
                    response.sendRedirect("/login");
                },
                new AntPathRequestMatcher("/**")
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedOrigin("http://192.168.100.38:5173");
        config.addAllowedOriginPattern("https://*.ngrok-free.app");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}