package com.sbsurvey.app.security;

import com.sbsurvey.app.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.SignatureAlgorithm;

import javax.annotation.PostConstruct;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtProperties properties;
    private PrivateKey signingKey;
    private PublicKey verificationKey;

    private static final String DEFAULT_PRIVATE_KEY_BASE64 = "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDsi45bov5ZkHtsdNNST4nc+t9lt1QiVq2vwC40gQX20amUiHo+PHop2BvWulUyWY35DmFBkGwXBIRVjB4oM3BbsWo/7qz2catCHFXcsusHaNkjCeCOeqrD9A4Gw3KtfdDeCIZTnE++nH2zukL7RzEcQKHIiquIvYx807PQdgcyrSJqv/y2+3mZtPH4gul+cPdfs/7XVv9ivz2/MqKpRIwNtznSpoouQhF2CxE7Bm6GvM9boeHNaoc3meAap0T6kQLg3FxGqq2vGgTGTZAR8k2UcOWgX6TXhOyAhEGNnZShnVmtusLrre2E/qojPdrL76FIK32iY6aoUeIFUPS4YjiDAgMBAAECggEABV2C/JwdVc27pvGda3QHZf5Au+9lFqRNqztaMPGuP3Nw+7/+udOoV7OhqgSu8wXp/PixBwouEXWWRNR5SKMmDMZg6RNSVAKvBkBbSDa8sv3TUwKh18l7fxdVjBy5yKqeZrLdzR6yBlpJVZ7HbyilugTTRpeynVbjTV+F6BgNQL52a71lkephf3QyRPfw0Mu7ZPe0gydSWLJ2hdVz89GCQ81g8/9YzktjyBKdQbsjcmttXQkY6LhJvOUh7tuAm6djcCuhvClhQbgU/AwYXbBdNInqB/d0DFWAevdpKbgGzFBPyta4wu3MaSOXwnHtq0PbZlZ0vabW4cX/PtxPH6934QKBgQD57Ze56qfLWB/aL6oQJzw9FFz5TvqG9+z5mYVVY/oNKTjyVI0NLYYzMlaP0vYTr4/ptQT0YgnypNlShSApGbTFHxj+BhhqCi38qNzMYhn1l0TaeFTf1L9DMfsQ21bZQZW9rosScZQoUoERIkwCLJTG3HrSWzkRt7yy5Bs3mLt/YQKBgQDySrqthMeC4tRuH2+TYUW+kLngndStdO3Icc0GyY9eNDRwwoEGPDN1pjsfRQktXYaox1dGfKauB5+aanwXzerHFumHysFhKY57pmzRgFwbjsK4mV0AHiVcErWZjdHhSk+/9tTT7Xm4+wlIZlkSBf3T7dMZTkysxbi+WjRHEfG2YwKBgGCDW8Az2bAwy7waA/ZQ8HY10uGDmkNcomqQ2mhrPzit3ovWEtIv7k7+9WZ89QINHeoGOW+WHHlTJ4kyV4UHpEMrCx+tgugQHkofe4SBrbylObWUGlKFeYadWnLcAOHM7eJd8N6idbBMjALt16RPSvSwV8275IHvDjOW2tvRYzaBAoGAcWBsqEOoxGN2Oi21nUZ4R2sbv7K7UYuUtSYjZZit4MwW+ejaTVugTN5Dbid02uiX2aSl/1LXADqLAcvwU4dE5HKhRqym/tteVBgVdZdWAoM0NQN21FZG7yXGGpuVaZHHbbGH9795JQk7V8ikx11MYH46OO49zN8cyt4U9mi8LbcCgYABLdr5FijFHoPMRzwNXSqQw21Dj4u1O//q+OB/nL9wJl1/eG4e7Y1/ZVelP5i+l1x0R8yW0mkZJgllWKAAPL+2kjEF98lrNd5iXOhK9Ud778t46MFQ4+woeMbg9UXtx3z8FCfsXowh+3ohDV1mD4F1mfJ47SA75nKlsirzt4RZQA==";
    private static final String DEFAULT_PUBLIC_KEY_BASE64 = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7IuOW6L+WZB7bHTTUk+J3PrfZbdUIlatr8AuNIEF9tGplIh6Pjx6Kdgb1rpVMlmN+Q5hQZBsFwSEVYweKDNwW7FqP+6s9nGrQhxV3LLrB2jZIwngjnqqw/QOBsNyrX3Q3giGU5xPvpx9s7pC+0cxHEChyIqriL2MfNOz0HYHMq0iar/8tvt5mbTx+ILpfnD3X7P+11b/Yr89vzKiqUSMDbc50qaKLkIRdgsROwZuhrzPW6HhzWqHN5ngGqdE+pEC4NxcRqqtrxoExk2QEfJNlHDloF+k14TsgIRBjZ2UoZ1ZrbrC663thP6qIz3ay++hSCt9omOmqFHiBVD0uGI4gwIDAQAB";

    @PostConstruct
    void init() {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            String privateKeySource = properties.getPrivateKey();
            if (privateKeySource == null || privateKeySource.isBlank()) {
                privateKeySource = DEFAULT_PRIVATE_KEY_BASE64;
            }
            String publicKeySource = properties.getPublicKey();
            if (publicKeySource == null || publicKeySource.isBlank()) {
                publicKeySource = DEFAULT_PUBLIC_KEY_BASE64;
            }

            byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeySource.replaceAll("\\s", ""));
            byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeySource.replaceAll("\\s", ""));

            this.signingKey = keyFactory.generatePrivate(new PKCS8EncodedKeySpec(privateKeyBytes));
            this.verificationKey = keyFactory.generatePublic(new X509EncodedKeySpec(publicKeyBytes));
        } catch (Exception ex) {
            throw new IllegalStateException("Invalid RSA keys for JWT configuration", ex);
        }
    }

    public String generateToken(UserDetails userDetails) {
        Instant now = Instant.now();
        Instant expiry = now.plus(properties.getExpirationMinutes(), ChronoUnit.MINUTES);
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiry))
                .signWith(signingKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(verificationKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration.before(new Date());
    }
}
