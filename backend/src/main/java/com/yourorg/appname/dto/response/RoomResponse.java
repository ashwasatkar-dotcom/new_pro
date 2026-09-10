package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private String wing;
    private Integer floor;
    private String roomType;
    private Integer capacity;
    private Integer occupiedBeds;
    private BigDecimal monthlyRent;
    private String status;
    private List<StudentResponse> occupants;
}
