package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class RoomRequest {
    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotBlank(message = "Wing is required")
    private String wing;

    @NotNull(message = "Floor is required")
    private Integer floor;

    @NotBlank(message = "Room type is required")
    private String roomType;

    @NotNull(message = "Capacity is required")
    private Integer capacity;

    private Integer occupiedBeds;
    private BigDecimal monthlyRent;
    private String status; // 'AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULL', 'MAINTENANCE'
}
