package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.LoginRequest;
import com.yourorg.appname.dto.request.RegisterRequest;
import com.yourorg.appname.dto.response.AuthResponse;
import com.yourorg.appname.dto.response.UserResponse;
import com.yourorg.appname.entity.Student;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.StudentRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.security.JwtUtil;
import com.yourorg.appname.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EntityMapper mapper;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new BadRequestException("Invalid username, ID, or password"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtUtil.generateToken(userDetails, user.getRole(), user.getId());

        Student student = studentRepository.findByUserId(user.getId()).orElse(null);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .department(user.getDepartment())
                .blockAssigned(user.getBlockAssigned())
                .studentId(student != null ? student.getId() : null)
                .rollNumber(student != null ? student.getRollNumber() : null)
                .roomNumber(student != null && student.getRoom() != null ? student.getRoom().getRoomNumber() : null)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username / ID is already registered");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        String role = request.getRole() != null && !request.getRole().isBlank()
                ? request.getRole()
                : "ROLE_STUDENT";

        String defaultAvatar = "ROLE_WARDEN".equalsIgnoreCase(role)
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDwfQuPj2ZlskBFeOtCqCInOeJdDLeYXRPR29TDK54xCx19QykDHGp2k4LljWsTnQ8EMb7dMBr9IKc6k12_1kWR9vsAJqRFI4UndWy_KAbSkmjLMpHpardYsFh8nSMM25Rdc04F7CQFGApKzxJxLCgKWZ6HZykYpZeSJ9wKKMcOhclTpUGmnMQdf2nrgemJWgEkbEcZRSnkZa3F6QplYhtCMl5ekWurCPHo_iB4qsDYv5UeGzRy6RHiEw"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuDuy0qw-a0fz4Lnt1ykfAmA0PESEuJsfJvjf9ieSQgb59EaFW4iFX5vDpNbrimJCNiirvjU8mGBfSyyn0XAv0WUoi7rUbyreBRbOsn1uDWFrWnlTZUyeobYMeVKn3IdawuA0VCjcnIRwDmYx3RDerJ9fUu-fnE63tQf3SGXfOxiEN2wLqglWADJMMoG-8Vk-y3WpAiiFi8zA8QWi5k8LAfZqyNTgqMz5qIX50-sYfPsSHkVrJ7L7vhnMQ";

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(role)
                .avatarUrl(defaultAvatar)
                .department(request.getDepartment() != null ? request.getDepartment() : "General")
                .blockAssigned(request.getBlockAssigned())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        Student student = null;
        if ("ROLE_STUDENT".equalsIgnoreCase(role)) {
            String roll = request.getRollNumber() != null && !request.getRollNumber().isBlank()
                    ? request.getRollNumber().trim().toUpperCase()
                    : request.getUsername().trim().toUpperCase();

            if (studentRepository.existsByRollNumber(roll)) {
                throw new BadRequestException("Student Roll Number (" + roll + ") is already registered. Please use your unique roll number or sign in.");
            }

            String acadYear = request.getAcademicYear() != null && !request.getAcademicYear().isBlank()
                    ? request.getAcademicYear()
                    : "1st Yr";

            Student newStudent = Student.builder()
                    .user(savedUser)
                    .rollNumber(roll)
                    .fullName(savedUser.getFullName())
                    .email(savedUser.getEmail())
                    .phone(savedUser.getPhone() != null && !savedUser.getPhone().isBlank() ? savedUser.getPhone() : "N/A")
                    .department(savedUser.getDepartment())
                    .academicYear(acadYear)
                    .attendanceRate(BigDecimal.valueOf(100.00))
                    .feeStatus("PENDING")
                    .status("ACTIVE")
                    .avatarUrl(defaultAvatar)
                    .build();

            student = studentRepository.save(newStudent);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
        String token = jwtUtil.generateToken(userDetails, savedUser.getRole(), savedUser.getId());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .avatarUrl(savedUser.getAvatarUrl())
                .department(savedUser.getDepartment())
                .blockAssigned(savedUser.getBlockAssigned())
                .studentId(student != null ? student.getId() : null)
                .rollNumber(student != null ? student.getRollNumber() : null)
                .roomNumber(null)
                .build();
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return mapper.toUserResponse(user);
    }
}
